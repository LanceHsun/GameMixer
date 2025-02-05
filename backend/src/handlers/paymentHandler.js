// src/handlers/paymentHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESClient();

// Handle new payment request
exports.handler = async (event) => {
  console.log('Payment request received:', {
    body: event.body,
    headers: event.headers,
    requestContext: event.requestContext
  });

  try {
    const body = JSON.parse(event.body);
    console.log('Parsed request body:', body);

    const { amount, customerEmail, customerName, orderDetails } = body;
    
    // Validate required fields
    if (!amount || !customerEmail || !customerName || !orderDetails) {
      console.error('Missing required fields:', { body });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Missing required fields',
          missingFields: Object.entries({ amount, customerEmail, customerName, orderDetails })
            .filter(([, value]) => !value)
            .map(([key]) => key)
        }),
      };
    }

    // Generate unique payment ID
    const paymentId = uuidv4();
    console.log('Generated payment ID:', paymentId);
    
    // Create payment record
    const paymentRecord = {
      id: paymentId,
      amount,
      customerEmail,
      customerName,
      orderDetails,
      status: 'PENDING',
      type: 'PAYMENT',
      createdAt: new Date().toISOString(),
    };
    
    console.log('Saving payment record to DynamoDB:', paymentRecord);

    // Save to DynamoDB
    try {
      await ddbDocClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: paymentRecord,
      }));
      console.log('Successfully saved payment record to DynamoDB');
    } catch (dbError) {
      console.error('Error saving to DynamoDB:', dbError);
      throw new Error('Failed to save payment record');
    }

    // Prepare email
    console.log('Preparing email with sender:', process.env.SENDER_EMAIL);
    const emailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [customerEmail],
      },
      Message: {
        Subject: {
          Data: 'Game Mixer - Payment Instructions',
        },
        Body: {
          Text: {
            Data: `
Dear ${customerName},

Thank you for your order at Game Mixer. Please follow these steps to complete your payment of $${amount}:

1. Open your Zelle app or banking app with Zelle
2. Send payment to: ${process.env.SENDER_EMAIL}
3. Amount to send: $${amount}
4. Important: Include this Payment ID in the memo: ${paymentId}

Once you've completed the payment, we will verify and process your order.

Order Details:
${JSON.stringify(orderDetails, null, 2)}

Best regards,
Game Mixer Team`,
          },
        },
      },
    };

    // Send email
    try {
      console.log('Sending email via SES:', { to: customerEmail });
      await sesClient.send(new SendEmailCommand(emailParams));
      console.log('Successfully sent email');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error('Failed to send payment instructions email');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Payment instructions sent successfully',
        paymentId,
        status: 'PENDING',
      }),
    };
  } catch (error) {
    console.error('Error processing payment:', {
      error: error.message,
      stack: error.stack,
      event: event
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error processing payment request',
        error: error.message,
      }),
    };
  }
};

// Verify payment status
exports.verifyPayment = async (event) => {
  console.log('Payment verification request received:', {
    body: event.body,
    headers: event.headers
  });

  try {
    const body = JSON.parse(event.body);
    const { paymentId } = body;

    if (!paymentId) {
      console.error('Missing payment ID in verification request');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Payment ID is required',
        }),
      };
    }

    console.log('Fetching payment record for ID:', paymentId);
    
    // Get payment record
    const { Item: payment } = await ddbDocClient.send(new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: paymentId },
    }));

    if (!payment) {
      console.error('Payment record not found for ID:', paymentId);
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Payment record not found',
        }),
      };
    }

    console.log('Found payment record:', payment);

    // Update payment status
    const updatedPayment = {
      ...payment,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
    };

    console.log('Updating payment record:', updatedPayment);

    try {
      await ddbDocClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: updatedPayment,
      }));
      console.log('Successfully updated payment record');
    } catch (dbError) {
      console.error('Error updating payment record:', dbError);
      throw new Error('Failed to update payment status');
    }

    // Send confirmation email
    const emailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [payment.customerEmail],
      },
      Message: {
        Subject: {
          Data: 'Game Mixer - Payment Confirmed',
        },
        Body: {
          Text: {
            Data: `
Dear ${payment.customerName},

We have confirmed your payment of $${payment.amount}. Thank you for your purchase!

Order Details:
${JSON.stringify(payment.orderDetails, null, 2)}

Payment ID: ${paymentId}
Amount: $${payment.amount}
Date: ${updatedPayment.completedAt}

Best regards,
Game Mixer Team`,
          },
        },
      },
    };

    try {
      console.log('Sending confirmation email:', { to: payment.customerEmail });
      await sesClient.send(new SendEmailCommand(emailParams));
      console.log('Successfully sent confirmation email');
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      throw new Error('Failed to send payment confirmation email');
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Payment verified successfully',
        payment: updatedPayment,
      }),
    };
  } catch (error) {
    console.error('Error verifying payment:', {
      error: error.message,
      stack: error.stack,
      event: event
    });
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error verifying payment',
        error: error.message,
      }),
    };
  }
};