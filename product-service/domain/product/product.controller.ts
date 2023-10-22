import DB from "../../utils/db";
import { mergeByProp } from "../../utils/mergeByProps";
import { Stock } from "../stock/model";
import { StockDB } from "../stock/stock.controller";
import { Product } from "./model";

class ProductDB extends DB {
  private readonly tableName: DB_Table;
  readonly stockDb: StockDB;

  constructor(Stock: typeof StockDB) {
    super();
    this.tableName = process.env.PRODUCT_TABLE_NAME as string;
    this.stockDb = new Stock();
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

    const products = (await this.getItems(params)).Items as Array<Product>;
    const stocks = (await this.stockDb.getAll()).Items as Array<Stock>;

    const joined = mergeByProp(products, stocks, "id", "product_id");

    return joined;
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
