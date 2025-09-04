"use client";

import { useState } from "react";
import { sendMessage } from "../actions/ai";

export default function Chat() {
  const [history, setHistory] = useState<any[]>([
    {
      role: "user",
      parts: [{ text: "Hello" }],
    },
    {
      role: "model",
      parts: [{ text: "Great to meet you. What would you like to know?" }],
    },
  ]);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  async function handleSend() {
    if (!input.trim()) return;

    const newHistory = [...history, { role: "user", parts: [{ text: input }] }];
    setHistory(newHistory);
    setInput("");

    const response = await sendMessage(newHistory, input);

    setHistory((prev) => [
      ...prev,
      { role: "model", parts: [{ text: response }] },
    ]);

    setMessages((prev) => [...prev, `You: ${input}`, `AI: ${response}`]);
  }

  return (
    <div className="p-4 border rounded-lg max-w-md space-y-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className="text-sm">
            {m}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
