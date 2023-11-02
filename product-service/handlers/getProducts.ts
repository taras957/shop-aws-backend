import { APIGatewayProxyHandler } from "aws-lambda";
import { ProductDB } from "../domain/product/product.controller";
import { StockDB } from "../domain/stock/stock.controller";
export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const db = new ProductDB(StockDB);
    const products = await db.getAllProducts();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(products || []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
