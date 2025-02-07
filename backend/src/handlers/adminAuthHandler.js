// src/handlers/adminAuthHandler.js
const { 
    CognitoIdentityProviderClient, 
    AdminCreateUserCommand, 
    AdminInitiateAuthCommand,
    AdminSetUserPasswordCommand,
    AdminGetUserCommand
  } = require('@aws-sdk/client-cognito-identity-provider');
  
  const cognitoClient = new CognitoIdentityProviderClient();
  
  /**
   * 处理管理员登录
   */
  exports.handleLogin = async (event) => {
    try {
      const { username, password } = JSON.parse(event.body);
  
      // 验证必填字段
      if (!username || !password) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            message: 'Username and password are required',
          }),
        };
      }
  
      // 调用 Cognito 进行身份验证
      const authResponse = await cognitoClient.send(new AdminInitiateAuthCommand({
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: process.env.COGNITO_CLIENT_ID,
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }));
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Login successful',
          token: authResponse.AuthenticationResult.IdToken,
          refreshToken: authResponse.AuthenticationResult.RefreshToken,
          expiresIn: authResponse.AuthenticationResult.ExpiresIn,
        }),
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        statusCode: error.name === 'NotAuthorizedException' ? 401 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: error.name === 'NotAuthorizedException' 
            ? 'Invalid username or password' 
            : 'Error processing login request',
          error: error.message,
        }),
      };
    }
  };
  
  /**
   * 创建新管理员用户
   * 需要管理员权限
   */
  exports.handleCreateUser = async (event) => {
    try {
      const { username, email, temporaryPassword } = JSON.parse(event.body);
  
      // 验证必填字段
      if (!username || !email || !temporaryPassword) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            message: 'Username, email and temporary password are required',
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
            message: 'Invalid email format',
          }),
        };
      }
  
      // 创建用户
      await cognitoClient.send(new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
        ],
        TemporaryPassword: temporaryPassword,
        MessageAction: 'SUPPRESS', // 不发送邮件通知
      }));
  
      // 设置永久密码
    await cognitoClient.send(new AdminSetUserPasswordCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        Password: temporaryPassword,
        Permanent: true,
      }));
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Admin user created successfully',
          username,
          email,
        }),
      };
    } catch (error) {
      console.error('Create user error:', error);
      return {
        statusCode: error.name === 'UsernameExistsException' ? 409 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: error.name === 'UsernameExistsException'
            ? 'Username already exists'
            : 'Error creating admin user',
          error: error.message,
        }),
      };
    }
  };
  
  /**
   * 获取当前管理员信息
   * 需要管理员权限
   */
  exports.getCurrentUser = async (event) => {
    try {
      // 从授权头中获取用户名
      const username = event.requestContext.authorizer.claims['cognito:username'];
  
      // 获取用户详细信息
      const userResponse = await cognitoClient.send(new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
      }));
  
      // 从用户属性中提取邮箱
      const email = userResponse.UserAttributes.find(attr => attr.Name === 'email')?.Value;
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          username: userResponse.Username,
          email,
          created: userResponse.UserCreateDate,
          lastModified: userResponse.UserLastModifiedDate,
          enabled: userResponse.Enabled,
          status: userResponse.UserStatus,
        }),
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        statusCode: error.name === 'UserNotFoundException' ? 404 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: error.name === 'UserNotFoundException'
            ? 'User not found'
            : 'Error getting user information',
          error: error.message,
        }),
      };
    }
  };