'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useWebSocket } from '@/lib/useWebSocket';

interface ChatProps {
  userId?: number;
  isAdmin?: boolean;
  onNewMessage?: () => void;
}

export default function Chat({ userId, isAdmin = false, onNewMessage }: ChatProps) {
  const { t } = useTranslation('common');
  const { messages, notifications, sendMessage } = useWebSocket(userId, isAdmin);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isAdmin) {
      const handleNewMessage = () => {
        onNewMessage?.();
      };
      window.addEventListener('new_customer_message', handleNewMessage);
      return () => window.removeEventListener('new_customer_message', handleNewMessage);
    }
  }, [isAdmin, onNewMessage]);
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      if (isAdmin) {
        // Khi admin gửi tin nhắn, receiverId sẽ là userId của người dùng
        sendMessage(input, 11);
      } else {
        sendMessage(input);
      }
      setInput('');
    }
  };
  const filteredMessages = messages;
  // const filteredMessages = messages.filter(
  //   (msg) =>
  //     msg.senderId === userId ||
  //     msg.receiverId === userId ||
  //     (!msg.senderId && !msg.receiverId && !isAdmin) ||
  //     (isAdmin && (msg.receiverId === userId || msg.senderId === userId))
  // );

  console.log('Filtered messages:', filteredMessages);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-sky-900 text-white p-3 rounded-full shadow-lg hover:bg-sky-950 transition-colors flex items-center justify-center"
        >
          {/* You can put an icon or text here, e.g., "Chat" */}
          Chat
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col mt-2">
          {/* Header */}
          <div className="bg-sky-900 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('chat.title')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-sky-950 rounded-full p-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Notifications for admin */}
          {isAdmin && notifications.length > 0 && (
            <div className="bg-gray-100 p-2 text-sm text-yellow-800">
              {notifications[notifications.length - 1].message}
            </div>
            
          )}          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="text-gray-500">{t('chat.no_messages')}</p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${msg.isBot ? 'text-left' : 'text-right'}`}
                >
                  <p
                    className={`inline-block p-2 rounded-lg ${
                      msg.isBot ? 'bg-gray-200' : 'bg-sky-900 text-white'
                    }`}
                  >
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-sky-950 transition-colors"
              >
                {t('chat.send')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}