const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
import { Product } from "../domain/product/model";
import { products } from "../mock";

const dynamodbClient = new DynamoDBClient({ region: process.env.DB_REGION });

const DEFAULT_COUNT = 5;

exports.handler = async () => {
  const productTableName = process.env.PRODUCT_TABLE_NAME;
  const stocksTableName = process.env.STOCK_TABLE_NAME;

  const writeRequests1 = products.map((product) => ({
    PutRequest: {
      Item: {
        description: { S: product.description },
        id: { S: product.id },
        price: { N: product.price.toString() },
        title: { S: product.title },
      },
    },
  }));

  type Commands = Record<string, Array<Record<string, unknown>>>;
  const writeRequests = products.reduce(
    (acc: Commands, product: Product) => {
      const productCreateCommand = {
        PutRequest: {
          Item: {
            description: { S: product.description },
            id: { S: product.id },
            price: { N: product.price.toString() },
            title: { S: product.title },
          },
        },
      };

      const stockCreateCommand = {
        PutRequest: {
          Item: {
            product_id: { S: product.id },
            count: { N: DEFAULT_COUNT },
          },
        },
      };

      acc[productTableName].push(productCreateCommand);
      acc[stocksTableName].push(stockCreateCommand);

      return acc;
    },
    { [productTableName]: [], [stocksTableName]: [] }
  );

  const batchWriteCommand = new BatchWriteItemCommand({
    RequestItems: writeRequests,
  });

  try {
    await dynamodbClient.send(batchWriteCommand);
    console.log(
      `Added all products to ${productTableName} & ${stocksTableName}`
    );
    return { statusCode: 200, body: "Successfully added products to DynamoDB" };
  } catch (error) {
    console.error(`Error adding products: ${error.message}`);
    return { statusCode: 500, body: "Failed to add products to DynamoDB" };
  }
};
