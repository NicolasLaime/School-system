"use client"

import React, { useState, useEffect, useRef } from 'react'
import { helpBotData } from '@/lib/helpbot'
import Fuse from 'fuse.js'

const fuse = new Fuse(helpBotData, {
  keys: ['question', 'answer'],
  threshold: 0.6,
})

interface HelpChatProps {
  defaultOpen?: boolean
}

const HelpChat: React.FC<HelpChatProps> = ({ defaultOpen = false }) => {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findAnswer = (q: string): string => {
    const result = fuse.search(q)
    return result.length > 0
      ? result[0].item.answer
      : 'No encontré esa guía. Prueba: "¿Cómo creo una clase?" o "¿Cómo agrego un alumno?".'
  }

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    const botMsg = findAnswer(userMsg)
    setMessages(prev => [...prev, { user: userMsg, bot: botMsg }])
    setInput('')
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-xl z-50"
          title="Ayuda"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 border border-border rounded-2xl shadow-modal w-96 h-[500px] flex flex-col z-50 max-h-[80vh]">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold">Asistente de Ayuda</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Pregúntame cómo crear una clase, agregar alumnos, cargar notas, etc.
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-start">
                    <div className="bg-primary/10 text-foreground p-3 rounded-lg max-w-xs">
                      <strong>Tú:</strong> {msg.user}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-muted text-foreground p-3 rounded-lg max-w-xs">
                      <strong>Bot:</strong> {msg.bot}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="¿Cómo configuro ponderaciones?"
              />
              <button
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                onClick={sendMessage}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HelpChat
