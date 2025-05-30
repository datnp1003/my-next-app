'use client';
import { useState } from "react";

export function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    console.log("Gửi tin nhắn:", input);
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: input }
          ]
        }),
      });
      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content;
      if (aiContent) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Đã xảy ra lỗi. Vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
      console.log("Đã gửi xong");
    }
  }

  return (
    <div>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-sky-900 text-white p-3 rounded-full shadow-lg hover:bg-sky-950 transition-colors flex items-center justify-center"
        >
          AI
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="bg-sky-900 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-bold">AI Chat</span>
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
          {/* Nội dung chat AI */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.length === 0 && !loading && (
              <p className="text-gray-500 text-center mt-10">Chào bạn! Tôi là AI, hãy đặt câu hỏi...</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-sky-900 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-400 max-w-[70%]">
                  Đang trả lời...
                </div>
              </div>
            )}
          </div>
          {/* Ô nhập tin nhắn */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded px-3 py-2"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !loading) handleSend();
              }}
              disabled={loading}
            />
            <button
              className="bg-sky-900 text-white px-4 py-2 rounded hover:bg-sky-950 transition-colors"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}