import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import "source-map-support/register";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context,
  cb
) => {
  if (event["type"] !== "TOKEN") {
    cb("Unauthorized");
  }
  try {
    const authToken = event.authorizationToken;
    const methodArn = event.methodArn;

    const creds = authToken.split(" ")[1];
    // Decode the base64 string
    const decodedData = Buffer.from(creds, "base64").toString("utf8");

    const splittedData = decodedData.split(":");

    const userName = splittedData[0];

    const password = splittedData[1];

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
