import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export class SNSService {
  client: SNSClient;
  constructor(region: string) {
    this.client = new SNSClient({ region });
  }

  async sendTopic(topic: string) {
    const response = await this.client.send(
      new PublishCommand({
        Message: topic,
        TopicArn: process.env.SNS_ARN,
      })
    );
  }
}
