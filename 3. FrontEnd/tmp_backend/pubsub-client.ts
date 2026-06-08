/*
|---------------------------------------------------------------------------------------|
|  --> REGENERA ENTERPRISE SYSTEM v4.0                                                  |
|---------------------------------------------------------------------------------------|

PROJECT:       Regenera Bank
CEO:           Raphaela Cerveski
DEVELOPER:     Don Paulo Ricardo
ID:            2098233287
COPYRIGHT:     Copyright (c) 2026 Regenera Corporate

LICENSE:       EULA (End-User License Agreement)
PROTECTION:    PROPRIEDADE INTELECTUAL RESTRITA

WARNING:       TODOS OS DIREITOS RESERVADOS. Proibida a cópia, distribuição,
               engenharia reversa ou modificação não autorizada.

|---------------------------------------------------------------------------------------|
|  --> CLASSIFICATION: PROPRIETARY // DEVELOPER MAINTAINED // REQUIRES SENIOR REVIEW          |
|---------------------------------------------------------------------------------------|
*/

/**
 * @json
 * {
 *   "version": "7.0.0",
 *   "author": "Paulo Ricardo de Leão (RG-2098233287)"
 * }
 */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub, Topic, Subscription, Message } from '@google-cloud/pubsub';

@Injectable()
export class PubSubClientService implements OnModuleInit, OnModuleDestroy {
  private pubSubClient: PubSub;
  private readonly logger = new Logger(PubSubClientService.name);
  private topics: Map<string, Topic> = new Map();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.logger.log('Initializing Google Cloud Pub/Sub Client...');
    try {
      const projectId = this.configService.get<string>('GCP_PROJECT_ID');
      const keyFilename = this.configService.get<string>('GCP_KEY_FILENAME');

      this.pubSubClient = new PubSub({ projectId, keyFilename });
      this.logger.log(`Pub/Sub initialized for project: ${projectId}`);
    } catch (error) {
      this.logger.error('Failed to initialize Pub/Sub client', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing Pub/Sub Client...');
    if (this.pubSubClient) {
      await this.pubSubClient.close();
    }
  }

  async publishMessage(topicName: string, data: any): Promise<string> {
    try {
      let topic = this.topics.get(topicName);
      if (!topic) {
        topic = this.pubSubClient.topic(topicName);
        this.topics.set(topicName, topic);
      }

      const dataBuffer = Buffer.from(JSON.stringify(data));
      const messageId = await topic.publishMessage({ data: dataBuffer });
      this.logger.debug(`Message ${messageId} published to topic ${topicName}`);
      return messageId;
    } catch (error) {
      this.logger.error(`Error publishing message to ${topicName}:`, error);
      throw error;
    }
  }

  async subscribe(subscriptionName: string, messageHandler: (message: Message) => void): Promise<Subscription> {
    try {
      const subscription = this.pubSubClient.subscription(subscriptionName);
      subscription.on('message', messageHandler);
      subscription.on('error', (error) => {
        this.logger.error(`Subscription error [${subscriptionName}]:`, error);
      });
      this.logger.log(`Subscribed to ${subscriptionName}`);
      return subscription;
    } catch (error) {
      this.logger.error(`Error subscribing to ${subscriptionName}:`, error);
      throw error;
    }
  }
}
