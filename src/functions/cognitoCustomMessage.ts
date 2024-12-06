import { CustomMessageTriggerEvent } from "aws-lambda";

// Templates HTML separados para cada tipo de email
const getSignUpTemplate = (x: string, code: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our App</title>
    <style>
        /* Reset de email client */
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            font-family: Arial, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        
        .header {
            background-color: #4F46E5;
            padding: 20px;
            text-align: center;
        }
        
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        
        .content {
            padding: 30px 20px;
            background-color: #f9fafb;
        }
        
        .code-box {
            background-color: #ffffff;
            border: 2px solid #4F46E5;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        
        .code {
            font-size: 32px;
            color: #4F46E5;
            font-weight: bold;
            letter-spacing: 5px;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
        }

        /* Botão estilizado */
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Our App! 🎉</h1>
        </div>
        
        <div class="content">
            <h2>Hello, ${name}!</h2>
            <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
            
            <div class="code-box">
                <div class="code">${code}</div>
            </div>
            
            <p>This code will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
            
            <!-- Logo ou imagem pode ser adicionada aqui -->
            <img src="https://your-bucket.s3.region.amazonaws.com/logo.png" alt="Logo" style="max-width: 150px; margin: 20px auto; display: block;">
        </div>
        
        <div class="footer">
            <p>© 2024 Your Company Name. All rights reserved.</p>
            <p>Address, City, Country</p>
        </div>
    </div>
</body>
</html>
`;

const getForgotPasswordTemplate = (name: string, code: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        /* Mesmos estilos do template anterior... */
        /* Adicione ou modifique conforme necessário */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <h2>Hello, ${name}!</h2>
            <p>We received a request to reset your password. Use the code below to proceed:</p>
            
            <div class="code-box">
                <div class="code">${code}</div>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        
        <div class="footer">
            <p>© 2024 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export async function handler(event: CustomMessageTriggerEvent) {
  if(event.triggerSource === "CustomMessage_SignUp") {
    const name = event.request.userAttributes.given_name;
    event.response.emailSubject = `Welcome to our app ${name}! Please confirm your account`;
    event.response.emailMessage = getSignUpTemplate(name, event.request.codeParameter);
  }
  
  if(event.triggerSource === "CustomMessage_ForgotPassword") {
    const name = event.request.userAttributes.given_name;
    event.response.emailSubject = "Reset your password";
    event.response.emailMessage = getForgotPasswordTemplate(name, event.request.codeParameter);
  }

  return event;
}