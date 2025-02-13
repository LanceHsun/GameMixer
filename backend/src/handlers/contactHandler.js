// src/handlers/contactHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const VALID_CATEGORIES = [
  'Sponsors and Partners',
  'Donation',
  'Membership',
  'Volunteers',
  'Other'
];

exports.submitContact = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, email, message, category } = body;
    
    // 验证必填字段
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

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Invalid email format'
        }),
      };
    }

    // 验证分类
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
    
    // 生成联系ID
    const contactId = uuidv4();
    
    // 创建联系记录
    const contactItem = {
      id: contactId,
      email,
      name,
      message,
      category: category || 'Other',
      createdAt: new Date().toISOString(),
      type: 'CONTACT'
    };

    // 保存到数据库
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: contactItem,
    }));

    // 发送邮件通知
    await Promise.all([
      emailService.sendContactConfirmation(name, email, category, message),
      emailService.sendContactNotification(name, email, category, message)
    ]);

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
    console.error('Error processing contact form:', error);
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