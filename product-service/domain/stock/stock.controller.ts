import DB from "../../utils/db";
import { Stock } from "./model";

export class StockDB extends DB {
  private readonly tableName: string;

  constructor() {
    super();
    this.tableName = process.env.STOCK_TABLE_NAME as string;
  }

  async createStockItem(stock: Stock) {
    const params = {
      TableName: this.tableName,
      Item: stock,
    };
    return this.createItem(params);
  }

  async getAll() {
    const params = {
      TableName: this.tableName,
    };
    return this.getItems(params);
  }

  async updateStock(stock: Stock) {
    const params = {
      TableName: this.tableName,
      Key: { productId: { S: stock.product_id } },
      UpdateExpression: "SET quantity = :quantity",
      ExpressionAttributeValues: {
        ":quantity": { N: stock.count.toString() },
      },
    };
    return this.updateItem(params);
  }
}
