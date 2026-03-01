'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from './ChatMessage';

interface BriefViewProps {
  brief: string;
  isLoading?: boolean;
}

export function BriefView({ brief, isLoading = false }: BriefViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <div className="bg-dark-surface rounded-lg p-4 space-y-2">
          <div className="h-4 bg-dark-elevated rounded w-3/4" />
          <div className="h-4 bg-dark-elevated rounded w-full" />
          <div className="h-4 bg-dark-elevated rounded w-5/6" />
        </div>
      ) : (
        <ChatMessage role="ida" content={brief} />
      )}
    </motion.div>
  );
}
