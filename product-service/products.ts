import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { products } from "./mock";

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ products }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
