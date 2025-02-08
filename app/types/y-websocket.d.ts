declare module 'y-websocket/bin/utils' {
  import { WebSocket } from 'ws';
  
  export function setupWSConnection(
    ws: WebSocket,
    request?: any,
    options?: {
      docName?: string;
      gc?: boolean;
    }
  ): void;
} 