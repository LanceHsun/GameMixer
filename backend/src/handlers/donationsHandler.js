// src/handlers/donationsHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// 处理现金捐赠
exports.handleMonetaryDonation = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { 
      amount,           // 捐赠金额
      contactEmail,     // 联系邮箱
      paymentMethod = 'ZELLE'  // 支付方式，目前固定为 ZELLE
    } = body;

    // 验证必填字段
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

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
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

    const donationId = uuidv4();
    
    // 创建捐赠记录
    const donationRecord = {
      id: donationId,
      type: 'MONETARY',
      amount: parseFloat(amount),
      contactEmail,
      paymentMethod,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // 保存到数据库
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: donationRecord,
    }));

    // 发送邮件通知
    await Promise.all([
      emailService.sendMonetaryDonationInstructions(contactEmail, amount, donationId),
      emailService.sendMonetaryDonationNotification(contactEmail, amount, donationId)
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
    console.error('Error processing monetary donation:', error);
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

// 处理物品捐赠
exports.handleGoodsDonation = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { 
      donationType,    // VENUE_SPACE, GAMES, GIFTS, OTHER
      details,         // 捐赠物品的具体描述
      contactEmail     // 联系邮箱
    } = body;

    // 验证必填字段
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

    // 验证捐赠类型
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

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
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

    const donationId = uuidv4();
    
    // 创建捐赠记录
    const donationRecord = {
      id: donationId,
      type: 'GOODS',
      goodsType: donationType,
      details,
      contactEmail,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // 保存到数据库
    await ddbDocClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: donationRecord,
    }));

    // 发送邮件通知
    await Promise.all([
      emailService.sendGoodsDonationConfirmation(contactEmail, donationType, details, donationId),
      emailService.sendGoodsDonationNotification(contactEmail, donationType, details, donationId)
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
    console.error('Error processing goods donation:', error);
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