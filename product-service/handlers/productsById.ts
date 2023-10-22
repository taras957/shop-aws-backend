import { APIGatewayEvent } from "aws-lambda";
import { ProductDB } from "../domain/product/product.controller";

export const getProductsById = async (event: APIGatewayEvent) => {
  try {
    const id = event.queryStringParameters?.productId;

    const db = new ProductDB();
    const product = await db.getProduct(id);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(product.Items || []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
