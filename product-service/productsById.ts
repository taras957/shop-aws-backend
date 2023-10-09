import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { products } from "./mock";

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId } = event.pathParameters;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        products: products.filter((product) => product.id === productId),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
