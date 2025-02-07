// src/handlers/contactHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESClient();

const VALID_CATEGORIES = [
  'Sponsors and Partners',
  'Donation',
  'Membership',
  'Volunteers',
  'Other'
];

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, message, category } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Missing required fields',
          missingFields: Object.entries({ name, email, message })
            .filter(([, value]) => !value)
            .map(([key]) => key)
        }),
      };
    }

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid category',
          validCategories: VALID_CATEGORIES
        }),
      };
    }
    
    // Generate unique ID
    const contactId = uuidv4();
    
    // Create contact item
    const contactItem = {
      id: contactId,
      email,
      name,
      message,
      category: category || 'Other', // Default to 'Other' if not provided
      createdAt: new Date().toISOString(),
      type: 'CONTACT'
    };

    // Store in DynamoDB
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: contactItem,
    }));

    // Send confirmation email
    const emailSubject = category 
      ? `Thank you for contacting Game Mixer - ${category}`
      : 'Thank you for contacting Game Mixer';

    const emailParams = {
      Source: process.env.SENDER_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: emailSubject,
        },
        Body: {
          Text: {
            Data: `Dear ${name},\n\nThank you for contacting us regarding ${category || 'your inquiry'}. We have received your message and will get back to you soon.\n\nYour message:\n${message}\n\nBest regards,\nGame Mixer Team`,
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