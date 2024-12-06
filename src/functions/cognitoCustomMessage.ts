import { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
  if(event.triggerSource === "CustomMessage_SignUp"){
    const name = event.request.userAttributes.given_name;
    event.response.emailSubject = `Welcome to our app ${name}! Please confirm your account`;
    event.response.emailMessage = `<h1>Hello ${name}</h1><br> here is your confirmation code: <strong>${event.request.codeParameter}</strong>`;
  }
  if(event.triggerSource === "CustomMessage_ForgotPassword"){
    const name = event.request.userAttributes.given_name;
    event.response.emailSubject = "Reset your password";
    event.response.emailMessage = `<h1>Hello ${name}</h1><br> here is your reset code: <strong>${event.request.codeParameter}</strong>`;
  }

  return event;
} 