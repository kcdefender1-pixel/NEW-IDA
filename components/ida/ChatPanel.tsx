'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'ida';
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  greeting?: string;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isLoading = false,
  greeting,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    const message = input.trim();
    setInput('');
    setIsSubmitting(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full bg-dark-bg"
    >
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Initial greeting if no messages */}
        {messages.length === 0 && greeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <ChatMessage role="ida" content={greeting} />
          </motion.div>
        )}

        {/* Chat messages */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8" />
            <div className="flex gap-1 items-center bg-dark-surface rounded-lg p-3">
              <div className="w-2 h-2 bg-ida-blue rounded-full animate-pulse" />
              <div
                className="w-2 h-2 bg-ida-blue rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-2 h-2 bg-ida-blue rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-dark-border p-4 bg-dark-surface">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask IDA about stories, patterns, strategy..."
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-ida-blue transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSubmitting || isLoading}
            className="px-4 py-2 bg-ida-amber text-dark-bg rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </motion.div>
  );
}
