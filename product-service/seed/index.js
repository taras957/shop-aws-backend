const AWS = require("aws-sdk");
const fs = require("fs");
const products = require("./mock");

const DEFAULT_COUNT = 5;

const stock = products.map((product) => ({
  product_id: product.id,
  count: DEFAULT_COUNT,
}));

const productsBatch = products.map((product) => ({
  PutRequest: {
    Item: AWS.DynamoDB.Converter.marshall(product),
  },
}));

const stockBatch = stock.map((item) => ({
  PutRequest: {
    Item: AWS.DynamoDB.Converter.marshall(item),
  },
}));

fs.writeFileSync(
  "seed/products.json",
  JSON.stringify({ Products: productsBatch }, null, 2)
);
fs.writeFileSync(
  "seed/stock.json",
  JSON.stringify({ stock: stockBatch }, null, 2)
);
