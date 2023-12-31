import { ObjectController } from "../controllers/object/object.controller";
import { S3Event } from "aws-lambda";

export async function handler(event: S3Event) {
  try {
    const region = process.env.REGION;

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, " ")
    );
    const objectController = new ObjectController(region);
    const s3Stream = await objectController.getObject({
      bucket,
      key,
    });

    const [folder, objectName] = key.split("/");
    await objectController.copy(bucket, folder, objectName, "parsed");

    await objectController.delete(bucket, key);

    const data = await objectController.send2Queue(s3Stream);
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      statusCode: 200,
      body: "Actions performed",
    };
  } catch (error) {
    console.log("🚀 ~ file: importFileParser.ts:33 ~ handler ~ error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
}
