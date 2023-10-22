import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

import {
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { OutputType } from "aws-sdk/clients/appsync";
import { Command } from "@smithy/types";
import { InputType } from "aws-sdk/clients/medialive";

class DB {
  private readonly client: DynamoDBClient;

  constructor(config?: DynamoDBClientConfig) {
    const dbClient = new DynamoDBClient({
      region: process.env.DB_REGION,
      ...config,
    });
    this.client = DynamoDBDocumentClient.from(dbClient);
  }

  async createItem<T>(params: { TableName: DB_Table; Item: T }) {
    const command = new PutCommand(params);
    return this.client.send(command);
  }

  async getItems(params: { TableName: DB_Table }) {
    const command = new ScanCommand(params);
    return await this.client.send(command);
  }

  async getItem(params: {
    TableName: DB_Table;
    KeyConditionExpression: string;
    ExpressionAttributeValues: { [key: string]: any };
  }) {
    const command = new QueryCommand(params);
    return this.client.send(command);
  }
  async updateItem<T extends Object>(params: T) {
    //@TODO define proper type annotation
    //@ts-ignore
    return this.client.send(params);
  }

  async deleteItem(params: DeleteCommand) {
    return this.client.send(params);
  }
}

export default DB;
