// src/handlers/contactHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, message } = body;
    
    // 生成唯一ID
    const contactId = uuidv4();
    
    // 存储到DynamoDB
    const contactItem = {
      id: contactId,
      email,
      name,
      message,
      createdAt: new Date().toISOString(),
      type: 'CONTACT'
    };

    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: contactItem,
    }));

    // 发送确认邮件
    const emailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Thank you for contacting Game Mixer',
        },
        Body: {
          Text: {
            Data: `Dear ${name},\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nBest regards,\nGame Mixer Team`,
          },
        },
      },
    };

    await sesClient.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Contact form submitted successfully',
        id: contactId,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error processing contact form submission',
        error: error.message,
      }),
    };
  }
};