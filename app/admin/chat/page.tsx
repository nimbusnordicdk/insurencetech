'use client'

import { useState } from 'react'

export default function AdminChatPage() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hej 👋 Jeg er din interne AI-assistent. Hvad vil du gerne have hjælp til?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { sender: 'user' as const, text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      })
      const data = await res.json()
      const aiMsg = { sender: 'ai' as const, text: data.reply || 'Jeg kunne ikke finde et svar 😅' }
      setMessages((m) => [...m, aiMsg])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { sender: 'ai', text: 'Der opstod en fejl ved kommunikation med AI-tjenesten.' },
      ])
    }
    setLoading(false)
  }

  return (
    <section id="chat" className="h-full flex flex-col">
      <h2 className="text-[22px] mb-7 text-[#e60000] font-semibold">AI Chat</h2>

      {/* Chatboks */}
      <div className="flex flex-col bg-white border border-[#e2e6ea] rounded-xl shadow-sm h-[600px] overflow-hidden">
        {/* Beskeder */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#fafbfc] flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`break-words whitespace-pre-wrap px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'self-end bg-[#e60000] text-white'
                  : 'self-start bg-[#f1f3f6] text-[#222]'
              }`}
              style={{
                width: 'fit-content',
                maxWidth: '70%',
              }}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="text-gray-500 text-sm italic self-start">
              AI skriver...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[#e2e6ea] bg-[#fafbfc] p-4 flex gap-3">
          <textarea
            rows={1}
            placeholder="Skriv en besked..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="flex-1 border border-[#d5d8dc] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#e60000]"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-[#e60000] hover:bg-[#b30000] text-white font-medium rounded-lg px-4 py-2"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  )
}
