import DB from "../../utils/db";
import { Product } from "./model";

class ProductDB extends DB {
  private readonly tableName: DB_Table;

  constructor() {
    super();
    this.tableName = process.env.PRODUCT_TABLE_NAME as string;
  }

  async createProduct(product: Product) {
    const params = {
      TableName: this.tableName,
      Item: product,
    };
    return this.createItem(params);
  }

  async getAllProducts() {
    const params = {
      TableName: this.tableName,
    };

    return this.getItems(params);
  }

  async getProduct(productId: string) {
    const getItemParams = {
      TableName: this.tableName,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": productId,
      },
    };
    return this.getItem(getItemParams);
  }
}

export { ProductDB };
