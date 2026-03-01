'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from './ChatMessage';

interface ScanProgressProps {
  isScanning: boolean;
  messages: string[];
}

export function ScanProgress({ isScanning, messages }: ScanProgressProps) {
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);

  useEffect(() => {
    if (isScanning) {
      setDisplayedMessages([]);
    }
  }, [isScanning]);

  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const timer = setTimeout(() => {
        setDisplayedMessages(messages);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messages, displayedMessages.length]);

  if (!isScanning && displayedMessages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {displayedMessages.map((msg, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChatMessage role="ida" content={msg} />
        </motion.div>
      ))}
      {isScanning && (
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
    </div>
  );
}
