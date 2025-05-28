import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const wss = new WebSocketServer({ port: 8081 });

// Lưu trữ client với sessionId/userId và vai trò
interface Client {
  ws: WebSocket;
  sessionId: string;
  userId?: number;
  isAdmin: boolean;
}

const clients: Map<string, Client> = new Map();

// Chatbot logic
function getBotResponse(message: string): string {
  const lowercase = message.toLowerCase();
  if (lowercase.includes('hello') || lowercase.includes('xin chào')) {
    return 'Chào bạn! Làm thế nào tôi có thể giúp bạn hôm nay?';
  } else if (lowercase.includes('price') || lowercase.includes('giá')) {
    return 'Vui lòng kiểm tra giá sản phẩm trên trang hoặc gửi tên sản phẩm cụ thể!';
  } else if (lowercase.includes('support') || lowercase.includes('hỗ trợ')) {
    return 'Đội ngũ hỗ trợ sẽ liên hệ với bạn sớm. Bạn cần giúp gì cụ thể?';
  }
  return 'Cảm ơn bạn đã liên hệ! Vui lòng cung cấp thêm thông tin để tôi hỗ trợ.';
}

wss.on('connection', (ws: WebSocket) => {
  const sessionId = uuidv4();
  const client: Client = { ws, sessionId, isAdmin: false };
  clients.set(sessionId, client);

  console.log(`Client connected: ${sessionId}`);

  ws.on('message', async (data: string) => {
    try {
      const { userId, content, isAdmin } = JSON.parse(data);
      client.userId = userId ? parseInt(userId) : undefined;
      client.isAdmin = isAdmin || false;

      // Xác định receiverId (admin hoặc người dùng)
      let receiverId: number | undefined;
      if (!client.isAdmin) {
        // Lấy thông tin admin qua API
        const adminResponse = await axios.get(`${API_URL}/users/admin`);
        receiverId = (adminResponse.data as { id: number }).id;
      } else {
        // Tin nhắn từ admin -> gửi tới người dùng (userId từ client)
        receiverId = +userId;
      }

      // Lưu tin nhắn vào cơ sở dữ liệu qua API
      const messageResponse = await axios.post(`${API_URL}/messages`, {
        content,
        senderId: client.userId,
        receiverId,
        isBot: false,
      });

      const message = messageResponse.data as {
        id: number;
        content: string;
        senderId: number;
        receiverId: number;
        isBot: boolean;
        createdAt: string;
      };

      // Gửi tin nhắn tới sender và receiver
      const messageData = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        isBot: message.isBot,
        createdAt: message.createdAt,
      };

      clients.forEach((c) => {
        if (
          c.ws.readyState === WebSocket.OPEN &&
          (c.userId === message.senderId ||
            c.userId === message.receiverId ||
            (!c.userId && c.sessionId === sessionId && !message.senderId) ||
            (c.isAdmin && message.receiverId === c.userId))
        ) {
          c.ws.send(JSON.stringify({ type: 'message', data: messageData }));
        }
      });

      // Thông báo cho admin
      if (!client.isAdmin) {
        clients.forEach((c) => {
          if (c.isAdmin && c.ws.readyState === WebSocket.OPEN) {
            c.ws.send(
              JSON.stringify({
                type: 'notification',
                data: {
                  message: `New message from user ${client.userId || 'guest'}`,
                  messageId: message.id,
                },
              }),
            );
          }
        });
      }

      // Chatbot phản hồi nếu là tin nhắn từ người dùng
      if (!client.isAdmin) {
        const botResponse = getBotResponse(content);
        const botMessageResponse = await axios.post(`${API_URL}/messages`, {
          content: botResponse,
          senderId: receiverId, // Admin gửi
          receiverId: client.userId,
          isBot: true,
        });

        const botMessage = botMessageResponse.data as {
          id: number;
          content: string;
          senderId: number;
          receiverId: number;
          isBot: boolean;
          createdAt: string;
        };

        const botMessageData = {
          id: botMessage.id,
          content: botMessage.content,
          senderId: botMessage.senderId,
          receiverId: botMessage.receiverId,
          isBot: botMessage.isBot,
          createdAt: botMessage.createdAt,
        };

        clients.forEach((c) => {
          if (
            c.ws.readyState === WebSocket.OPEN &&
            (c.userId === botMessage.senderId ||
              c.userId === botMessage.receiverId ||
              (!c.userId && c.sessionId === sessionId && !botMessage.receiverId))
          ) {
            c.ws.send(JSON.stringify({ type: 'message', data: botMessageData }));
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(sessionId);
    console.log(`Client disconnected: ${sessionId}`);
  });
});

console.log('WebSocket server running on ws://localhost:8080');