import { SQSEvent, SQSHandler } from "aws-lambda";
import * as crypto from "crypto";
import { ProductDB } from "../domain/product/product.controller";
import { StockDB } from "../domain/stock/stock.controller";
import { SNSService } from "../services/sns.seervice";

export const handler = async (event: SQSEvent) => {
  const productsFromQueue = event.Records;
  const snsService = new SNSService(process.env.REGION);
  try {
    for (const product of productsFromQueue) {
      const parsedProduct = JSON.parse(product.body);

      const db = new ProductDB(StockDB);
      await db.createProduct({
        id: crypto.randomUUID(),
        ...parsedProduct,
      });

      snsService.sendTopic("Products were added!");
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Action successful",
    };
  } catch (error) {
    console.log(
      "🚀 ~ file: catalogBatchProcess.ts:31 ~ handler ~ error:",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
