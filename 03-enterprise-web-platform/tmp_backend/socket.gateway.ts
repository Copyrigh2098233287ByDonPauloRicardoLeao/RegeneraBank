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
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as admin from 'firebase-admin';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/realtime',
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  afterInit(server: Server) {
    this.logger.log('Socket.io Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token || client.handshake.headers['authorization'];
    
    if (!token) {
      this.logger.warn(`Client disconnected (No token provided): ${client.id}`);
      client.disconnect();
      return;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
      const userId = decodedToken.uid;
      
      // Store userId in socket object for future reference
      client.data.userId = userId;

      // Join private room based on userId
      const userRoom = `user_${userId}`;
      client.join(userRoom);

      this.logger.log(`Client connected: ${client.id} (User: ${userId}). Joined room: ${userRoom}`);
    } catch (error: any) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    this.logger.log(`Client disconnected: ${client.id} (User: ${userId || 'Unknown'})`);
  }

  /**
   * Envia um evento para a sala privada de um usuário específico
   */
  sendToUser(userId: string, event: string, payload: any) {
    const room = `user_${userId}`;
    this.server.to(room).emit(event, payload);
    this.logger.debug(`Event '${event}' emitted to room '${room}'`);
  }

  /**
   * Broadcast genérico
   */
  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
