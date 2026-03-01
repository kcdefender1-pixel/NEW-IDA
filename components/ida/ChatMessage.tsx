'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from './Avatar';

interface ChatMessageProps {
  role: 'user' | 'ida';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar for IDA messages */}
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar state="complete" size="sm" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`flex-1 max-w-xs lg:max-w-md ${
          isUser
            ? 'bg-ida-blue text-white rounded-lg rounded-tr-none'
            : 'bg-dark-surface text-dark-text-primary rounded-lg rounded-tl-none border border-dark-border'
        } p-3 text-sm`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </p>
      </div>

      {/* Spacer for user messages */}
      {isUser && <div className="flex-shrink-0 w-8" />}
    </motion.div>
  );
}
