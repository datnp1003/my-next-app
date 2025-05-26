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
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      const { type, data } = JSON.parse(event.data);
      if (type === 'message') {
        setMessages((prev) => [...prev, data]);
      } else if (type === 'notification' && isAdmin) {
        setNotifications((prev) => [...prev, data]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
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