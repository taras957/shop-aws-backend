import { APIGatewayProxyHandler } from "aws-lambda";
import { ProductDB } from "../domain/product/product.controller";

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const db = new ProductDB();
    const products = await db.getAllProducts();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products.Items || []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
