import {
  PutObjectCommand,
  S3Client,
  S3,
  GetObjectCommand,
  GetObjectCommandOutput,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import csv from "csv-parser";
import { Readable } from "stream";

export const asStream = (response: GetObjectCommandOutput) => {
  return response.Body as Readable;
};

export class ObjectController {
  client: S3Client;
  s3: S3;

  constructor(region: string) {
    this.s3 = new S3({ region });
    this.client = new S3Client({ region });
  }

  async createPresignedUrlWithClient({ bucket, key }) {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }

  async getObject({ bucket, key }: { bucket: string; key: string }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });

    const commandResult: GetObjectCommandOutput = await this.client.send(
      command
    );

    return commandResult.Body as Readable;
  }
  parse(stream: Readable) {
    return new Promise((resolve, reject) => {
      const results = [];

      stream
        .pipe(csv())
        .on("data", (data) => {
          console.log("CSV Record:", data);
          results.push(data);
        })
        .on("end", () => {
          console.log("CSV Parsing Completed");
          resolve(results);
        })
        .on("error", (error) => {
          console.error("Error parsing CSV:", error);
          reject(error);
        });
    });
  }

  async delete(bucket: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
  async copy(bucket, folder: string, objectName: string, folderToMove: string) {
    const CopySource = `${bucket}/${folder}/${objectName}`;
    const destination = `${folderToMove}/${objectName}`;

    const command = new CopyObjectCommand({
      CopySource,
      Bucket: bucket,
      Key: destination,
    });

    try {
      const response = await this.client.send(command);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
}
