// src/handlers/donationHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESClient();

// Handle monetary donation
exports.handleMonetaryDonation = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { 
      amount,           // 捐赠金额
      contactEmail,     // 联系邮箱
      paymentMethod = 'ZELLE'  // 支付方式，目前固定为 ZELLE
    } = body;

    // Validate required fields
    if (!amount || !contactEmail) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Missing required fields',
          missingFields: Object.entries({ amount, contactEmail })
            .filter(([, value]) => !value)
            .map(([key]) => key)
        }),
      };
    }

    const donationId = uuidv4();
    
    // Create donation record
    const donationRecord = {
      id: donationId,
      type: 'MONETARY',
      amount: parseFloat(amount),
      contactEmail,
      paymentMethod,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Save to DynamoDB
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: donationRecord,
    }));

    // Send payment instructions to donor
    const donorEmailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [contactEmail],
      },
      Message: {
        Subject: {
          Data: 'Game Mixer - Donation Payment Instructions',
        },
        Body: {
          Text: {
            Data: `
Dear Donor,

Thank you for your generous donation of $${amount}! Please follow these steps to complete your donation:

1. Open your Zelle app or banking app with Zelle
2. Send payment to: ${process.env.SENDER_EMAIL}
3. Amount to send: $${amount}
4. Important: Include this Donation ID in the memo: ${donationId}

Once you've completed the payment, we will send you a donation receipt.

Thank you for supporting Game Mixer!

Best regards,
Game Mixer Team`,
          },
        },
      },
    };

    // Send notification to organization
    const orgEmailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [process.env.SENDER_EMAIL],
      },
      Message: {
        Subject: {
          Data: 'New Monetary Donation Received',
        },
        Body: {
          Text: {
            Data: `
New monetary donation initiated:

Amount: $${amount}
Contact Email: ${contactEmail}
Payment Method: ${paymentMethod}
Donation ID: ${donationId}
Status: PENDING`,
          },
        },
      },
    };

    // Send both emails
    await Promise.all([
      sesClient.send(new SendEmailCommand(donorEmailParams)),
      sesClient.send(new SendEmailCommand(orgEmailParams))
    ]);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Donation initiated successfully',
        donationId,
        status: 'PENDING'
      }),
    };
  } catch (error) {
    console.error('Error processing donation:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error processing donation',
        error: error.message,
      }),
    };
  }
};

// Handle goods donation
exports.handleGoodsDonation = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { 
      donationType,    // VENUE_SPACE, GAMES, GIFTS, OTHER
      details,         // 捐赠物品的具体描述
      contactEmail     // 联系邮箱
    } = body;

    // Validate required fields
    if (!donationType || !details || !contactEmail) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Missing required fields',
          missingFields: Object.entries({ donationType, details, contactEmail })
            .filter(([, value]) => !value)
            .map(([key]) => key)
        }),
      };
    }

    // Validate donation type
    const validTypes = ['VENUE_SPACE', 'GAMES', 'GIFTS', 'OTHER'];
    if (!validTypes.includes(donationType)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid donation type',
          validTypes
        }),
      };
    }

    const donationId = uuidv4();
    
    // Create donation record
    const donationRecord = {
      id: donationId,
      type: 'GOODS',
      goodsType: donationType,
      details,
      contactEmail,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Save to DynamoDB
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: donationRecord,
    }));

    // Send confirmation to donor
    const donorEmailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [contactEmail],
      },
      Message: {
        Subject: {
          Data: 'Thank You for Your Donation Offer',
        },
        Body: {
          Text: {
            Data: `
Dear Donor,

Thank you for your generous donation offer! We have received your submission and will contact you soon to discuss the details.

Donation Details:
Type: ${donationType}
Description: ${details}

Reference Number: ${donationId}

We greatly appreciate your support and will be in touch shortly!

Best regards,
Game Mixer Team`,
          },
        },
      },
    };

    // Send notification to organization
    const orgEmailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [process.env.SENDER_EMAIL],
      },
      Message: {
        Subject: {
          Data: 'New Goods Donation Offer Received',
        },
        Body: {
          Text: {
            Data: `
New goods donation offer received:

Type: ${donationType}
Description: ${details}
Contact Email: ${contactEmail}
Donation ID: ${donationId}`,
          },
        },
      },
    };

    // Send both emails
    await Promise.all([
      sesClient.send(new SendEmailCommand(donorEmailParams)),
      sesClient.send(new SendEmailCommand(orgEmailParams))
    ]);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Donation offer received successfully',
        donationId
      }),
    };
  } catch (error) {
    console.error('Error processing donation:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error processing donation offer',
        error: error.message,
      }),
    };
  }
};