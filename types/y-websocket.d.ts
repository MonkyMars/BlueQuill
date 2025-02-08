declare module 'y-websocket/bin/utils.cjs' {
  import { WebSocket } from 'ws';
  import { IncomingMessage } from 'http';

  export function setupWSConnection(
    ws: WebSocket,
    request?: IncomingMessage,
    options?: {
      docName?: string;
      gc?: boolean;
    }
  ): void;
} 