package main

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Client struct {
	conn       *websocket.Conn
	documentID string
	userID     string
}

var (
	clients = make(map[string][]*Client)
	mutex   = &sync.Mutex{}
)

func handleConnections(c *gin.Context) {
	documentID := c.Query("documentId")
	userID := c.Query("userId")
	if documentID == "" || userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing document or user ID"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("WebSocket Upgrade Error:", err)
		return
	}

	client := &Client{
		conn:       conn,
		documentID: documentID,
		userID:     userID,
	}

	mutex.Lock()
	clients[documentID] = append(clients[documentID], client)
	mutex.Unlock()

	defer func() {
		conn.Close()
		mutex.Lock()
		var updatedClients []*Client
		for _, cl := range clients[documentID] {
			if cl.conn != conn {
				updatedClients = append(updatedClients, cl)
			}
		}
		clients[documentID] = updatedClients
		mutex.Unlock()
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}

		// Broadcast message to all clients in the same document
		mutex.Lock()
		for _, client := range clients[documentID] {
			if client.conn != conn {
				err := client.conn.WriteMessage(websocket.TextMessage, msg)
				if err != nil {
					break
				}
			}
		}
		mutex.Unlock()
	}
}

func main() {
	r := gin.Default()
	r.GET("/ws", handleConnections)
	r.Run(":8080")
}
