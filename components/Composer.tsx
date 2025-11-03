'use client'
import React, { useRef, useState, useEffect } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { streamAI } from '../lib/ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

export default function Composer() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [assistantTyping, setAssistantTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const userAvatar = session?.user?.image || '/default-avatar.png'
  const aiAvatar = '/terra-logo.png'

  async function sendMessage() {
    if (!input.trim()) return

    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setAssistantTyping(true)

    let aiContent = ''
    for await (const chunk of streamAI([...messages, userMsg])) {
      aiContent += chunk
      setMessages(prev => {
        const newMsgs = [...prev]
        if (newMsgs[newMsgs.length - 1]?.role === 'assistant') {
          newMsgs[newMsgs.length - 1].content = aiContent
        } else {
          newMsgs.push({ role: 'assistant', content: aiContent })
        }
        return newMsgs
      })
    }

    setAssistantTyping(false)
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a1a1a] to-[#111] text-white">
      {/* Chat Bubble Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar kiri (AI) */}
            {m.role === 'assistant' && (
              aiAvatar ? (
                <img
                  src={aiAvatar}
                  alt="AI"
                  className="w-8 h-8 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white font-bold">
                  T
                </div>
              )
            )}

            {/* Bubble chat */}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white rounded-br-none'
                  : 'bg-white/10 text-gray-100 border border-white/10 rounded-bl-none'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <SyntaxHighlighter
                        {...props}
                        style={oneDark}
                        language={match?.[1] || 'text'}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-purple-300 text-sm">
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {m.content}
              </ReactMarkdown>
            </div>

            {/* Avatar kanan (User) */}
            {m.role === 'user' && (
              <img
                src={userAvatar}
                alt="User"
                className="w-8 h-8 rounded-full border border-white/20 object-cover"
              />
            )}
          </motion.div>
        ))}

        {/* AI typing shimmer */}
        {assistantTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-3"
          >
            {/* Avatar AI tetap tampil */}
            {aiAvatar ? (
              <img
                src={aiAvatar}
                alt="AI"
                className="w-8 h-8 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white font-bold">
                T
              </div>
            )}
            <div className="flex flex-col gap-2 bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
              <div className="h-3 w-32 bg-white/20 rounded animate-pulse" />
              <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 flex items-center gap-3 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tanya sesuatu ke TerraAI..."
          className="flex-1 px-4 py-3 rounded-full bg-white/5 text-white placeholder:text-gray-400 focus:outline-none"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center disabled:opacity-50"
          disabled={!input.trim() || assistantTyping}
        >
          <PaperAirplaneIcon className="w-5 h-5 text-white rotate-45" />
        </button>
      </div>
    </div>
  )
}
