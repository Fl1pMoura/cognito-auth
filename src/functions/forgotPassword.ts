import { ForgotPasswordCommand, NotAuthorizedException, UserNotConfirmedException, UserNotFoundException } from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { cognitoClient } from "../libs/cognitoClient";
import bodyParser from "../utils/bodyParser";
import { response } from "../utils/response";

export async function handler(event: APIGatewayProxyEventV2){
  try {
    const { email } = bodyParser(event.body);

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    })
    
    await cognitoClient.send(command)

    return response(200)
  }catch (error){
    console.log(error);
    if (error instanceof UserNotFoundException || error instanceof NotAuthorizedException) {
      return response(401, {
        message: 'Invalid Credentials!'
      });
    }

    if (error instanceof UserNotConfirmedException) {
      return response(401, {
        message: 'This email is not confirmed.'
      });
    }

    return response(500, {
      message: 'Something went wrong.'
    });
  }
}