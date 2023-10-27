import { APIGatewayEvent } from "aws-lambda";
import { ObjectController } from "../controllers/object/object.controller";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const fileName = event.queryStringParameters!.name;
    const folderName = "uploaded";
    // get the name of the file to be uploaded
    const fileKey = `${folderName}/${fileName}`;
    const region = process.env.REGION as string;
    //@todo use env instead
    const bucket = "import-bucket-aws";
    const controller = new ObjectController(region);
    const url = controller.createPresignedUrlWithClient({
      key: fileKey,
      bucket,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    console.log(
      "🚀 ~ file: handler.ts:25 ~ importProductsFile ~ error:",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
