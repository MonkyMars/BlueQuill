import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import { IncomingMessage } from "http";
import { WebSocket } from "ws";
import path from "path";

const app = express();
const server = http.createServer(app);

// Create a Yjs WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  console.log("New connection established");
  
  try {
    // Dynamically import y-websocket utils
    const yWebsocketPath = path.join(process.cwd(), 'node_modules', 'y-websocket', 'bin', 'utils');
    const { setupWSConnection } = await import(yWebsocketPath);
    
    // Extract document ID from URL if present
    const docName = req.url?.split("?")[0]?.slice(1) || "default";
    
    setupWSConnection(ws, req, {
      docName,
      gc: true // Enable garbage collection
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

  } catch (error) {
    console.error("Error setting up WebSocket connection:", error);
    ws.close();
  }
});

// Error handling for the WebSocket server
wss.on("error", (error) => {
  console.error("WebSocket Server error:", error);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`WebSocket server running on port ${port}`);
});

// Handle server shutdown gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  wss.close(() => {
    console.log("WebSocket server closed");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
});
