'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useWebSocket } from '@/lib/useWebSocket';

interface ChatProps {
  userId?: number;
  isAdmin?: boolean;
}

export default function Chat({ userId, isAdmin = false }: ChatProps) {
  const { t } = useTranslation('common');
  const { messages, notifications, sendMessage } = useWebSocket(userId, isAdmin);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  // Lọc tin nhắn liên quan đến người dùng hiện tại
  // const filteredMessages = messages.filter(
  //   (msg) =>
  //     msg.senderId === userId ||
  //     msg.receiverId === userId ||
  //     (!msg.senderId && !msg.receiverId && !isAdmin) ||
  //     (isAdmin && (msg.receiverId === userId || msg.senderId === userId)),
  // );

  const filteredMessages = messages;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          {/* You can put an icon or text here, e.g., "Chat" */}
          Chat
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col mt-2">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('chat.title')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded-full p-1 transition-colors"
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
            <div className="bg-yellow-100 p-2 text-sm text-yellow-800">
              {notifications[notifications.length - 1].message}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="text-gray-500">{t('chat.no_messages')}</p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${msg.senderId === userId || (!msg.senderId && !isAdmin) ? 'text-right' : 'text-left'}`}
                >
                  <p
                    className={`inline-block p-2 rounded-lg ${
                      msg.senderId === userId || (!msg.senderId && !isAdmin)
                        ? 'bg-blue-500 text-white'
                        : msg.isBot
                        ? 'bg-green-200'
                        : 'bg-gray-200'
                    }`}
                  >
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
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
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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