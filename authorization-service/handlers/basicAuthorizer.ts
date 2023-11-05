import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import "source-map-support/register";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context,
  cb
) => {
  console.log(
    "🚀 ~ file: basicAuthorizer.handler.ts:5~ event:",
    JSON.stringify(event)
  );
  if (event["type"] !== "TOKEN") {
    cb("Unauthorized");
  }
  try {
    const authToken = event.authorizationToken;
    const methodArn = event.methodArn;

    const creds = authToken.split(" ")[1];
    const buffer = Buffer.from(creds, "base64");
    const plainCreds = buffer.toString("utf-8").split(":");

    const userName = plainCreds[0];
    console.log(
      "🚀 ~ file: basicAuthorizer.handler.ts:27 ~ userName:",
      userName
    );
    const password = plainCreds[1];
    console.log(
      "🚀 ~ file: basicAuthorizer.handler.ts:29 ~ password:",
      password
    );

    const storedPassword = process.env[userName];

    const access =
      !storedPassword || storedPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(creds, methodArn, access);

    cb(null, policy);
  } catch (error) {
    cb(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (
  principalId: string,
  resource: string,
  effect: "Allow" | "Deny"
) => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
