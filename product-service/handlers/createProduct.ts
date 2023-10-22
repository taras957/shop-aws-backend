import { APIGatewayProxyHandler } from "aws-lambda";
import * as crypto from "crypto";
import { ProductDB } from "../domain/product/product.controller";

export const create = async (event: {
  title: string;
  description: string;
  price: number;
}) => {
  try {
    const { title, description, price } = event || {};

    const db = new ProductDB();
    const product = await db.createProduct({
      id: crypto.randomUUID(),
      title,
      description,
      price,
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
      body: JSON.stringify({ error }),
    };
  }
};
