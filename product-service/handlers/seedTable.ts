const {
  DynamoDBClient,
  BatchWriteItemCommand,
} = require("@aws-sdk/client-dynamodb");
import { products } from "../mock";

const dynamodbClient = new DynamoDBClient({ region: process.env.DB_REGION });

exports.handler = async () => {
  const tableName = process.env.PRODUCT_TABLE_NAME;
  const writeRequests = products.map((product) => ({
    PutRequest: {
      Item: {
        description: { S: product.description },
        id: { S: product.id },
        price: { N: product.price.toString() },
        title: { S: product.title },
      },
    },
  }));

  const batchWriteCommand = new BatchWriteItemCommand({
    RequestItems: {
      [tableName]: writeRequests,
    },
  });

  try {
    await dynamodbClient.send(batchWriteCommand);
    console.log(`Added all products to ${tableName}`);
    return { statusCode: 200, body: "Successfully added products to DynamoDB" };
  } catch (error) {
    console.error(`Error adding products: ${error.message}`);
    return { statusCode: 500, body: "Failed to add products to DynamoDB" };
  }
};
