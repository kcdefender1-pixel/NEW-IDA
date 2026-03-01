'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar } from './Avatar';

type AvatarState =
  | 'idle'
  | 'listening'
  | 'scanning'
  | 'thinking'
  | 'alert'
  | 'complete';

interface StatusBarProps {
  status: AvatarState;
  message?: string;
}

const STATUS_MESSAGES: Record<AvatarState, string> = {
  idle: 'Ready',
  listening: 'Listening',
  scanning: 'Scanning Kansas City...',
  thinking: 'Analyzing stories...',
  alert: 'Alert',
  complete: 'Brief ready',
};

export function StatusBar({
  status,
  message,
}: StatusBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 bg-dark-surface border-b border-dark-border"
    >
      {/* Left side: Avatar + Status */}
      <div className="flex items-center gap-4">
        <Avatar state={status} size="md" />
        <div>
          <h1 className="text-lg font-bold text-ida-amber">IDA</h1>
          <p className="text-xs text-dark-text-muted">
            {message || STATUS_MESSAGES[status]}
          </p>
        </div>
      </div>

      {/* Right side: Settings button */}
      <Link
        href="/settings"
        className="p-2 hover:bg-dark-elevated rounded-lg transition-colors text-dark-text-secondary hover:text-dark-text-primary"
        title="Settings"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="10" cy="10" r="1.5" />
          <path d="M10 3v2.5" />
          <path d="M10 14.5v2.5" />
          <path d="M15.5 10h-2.5" />
          <path d="M3 10h2.5" />
          <path d="M13.4 13.4l-1.8-1.8" />
          <path d="M8.4 8.4l-1.8-1.8" />
          <path d="M13.4 6.6l-1.8 1.8" />
          <path d="M8.4 11.6l-1.8 1.8" />
        </svg>
      </Link>
    </motion.div>
  );
}
