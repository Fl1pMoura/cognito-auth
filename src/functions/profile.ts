import { AdminGetUserCommand, AttributeType } from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { cognitoClient } from "../libs/cognitoClient";
import { response } from "../utils/response";

interface MappedUser {
  email: string;
  verifiedEmail: boolean;
  firstName: string;
  lastName: string;
  userId: string;
}

// Função atualizada para receber AttributeType[] diretamente
function mapCognitoUser(attributes: AttributeType[]): MappedUser {
  const getAttribute = (name: string): string => {
    const attr = attributes.find(attr => attr.Name === name);
    return attr?.Value ?? '';
  };

  return {
    email: getAttribute('email'),
    verifiedEmail: getAttribute('email_verified') === 'true',
    firstName: getAttribute('given_name'),
    lastName: getAttribute('family_name'),
    userId: getAttribute('sub')
  };
}

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  const command = new AdminGetUserCommand({
    Username: userId,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  })

  const { UserAttributes } = await cognitoClient.send(command);
  const mappedUser = mapCognitoUser(UserAttributes ?? []);
  return response(200, {profile: mappedUser});
}