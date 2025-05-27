'use client';

import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: number;
  content: string;
  senderId?: number;
  receiverId?: number;
  isBot: boolean;
  createdAt: string;
}

interface Notification {
  message: string;
  messageId: number;
}

export function useWebSocket(userId?: number, isAdmin: boolean = false) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionId = useRef<string>(uuidv4()).current;

  useEffect(() => {
    let ws: WebSocket;
    
    try {
      ws = new WebSocket('ws://localhost:8081');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        // Gửi message test khi kết nối thành công
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log('Connection state:', wsRef.current.readyState);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onmessage = (event) => {
        try {
          console.log('Raw message received:', event.data);
          const { type, data } = JSON.parse(event.data);
          console.log('Parsed message:', { type, data });
          
          if (type === 'message') {
            setMessages((prev) => [...prev, data]);
          } else if (type === 'notification' && isAdmin) {
            setNotifications((prev) => [...prev, data]);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }

    return () => {
      if (ws) {
        console.log('Cleaning up WebSocket connection');
        ws.close();
      }
    };
  }, [isAdmin]);

  const sendMessage = (content: string) => {
    console.log('Sending message:', wsRef.current);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = { userId, content, isAdmin, sessionId };
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { messages, notifications, sendMessage };
}