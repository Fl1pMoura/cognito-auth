import { CodeMismatchException, ConfirmForgotPasswordCommand, InvalidParameterException } from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { cognitoClient } from "../libs/cognitoClient";
import bodyParser from "../utils/bodyParser";
import { response } from "../utils/response";

export async function handler(event: APIGatewayProxyEventV2){
  try {
    const { email, code, newPassword } = bodyParser(event.body);

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    })
    
    await cognitoClient.send(command)

    return response(200)
  }catch (error){
    console.log(error);
    if (error instanceof CodeMismatchException){
      return response(500, {
        message: 'Invalid code!'
      });
    }

    if (error instanceof InvalidParameterException){
      return response(500, {
        message: 'Invalid parameter!'
      });
    }

    return response(500, {
      message: 'Something went wrong.'
    });
  }
}