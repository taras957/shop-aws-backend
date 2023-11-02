import { APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import * as crypto from "crypto";
import { ProductDB } from "../domain/product/product.controller";
import { StockDB } from "../domain/stock/stock.controller";

export const create = async (event: APIGatewayEvent) => {
  try {
    const { title, description, price, count } = JSON.parse(event.body);

    const db = new ProductDB(StockDB);
    const product = await db.createProduct({
      id: crypto.randomUUID(),
      title,
      description,
      price,
      count,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
