'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface StoryCardProps {
  id: string;
  title: string;
  source: string;
  summary: string;
  framingAdvice: string;
  strategicValue: string;
  relevanceScore: number;
  timeUrgency: string;
  suggestedWriter: string;
  url: string;
  onMarkCovered?: (id: string) => Promise<void>;
  onSkip?: (id: string) => Promise<void>;
}

const STRATEGIC_VALUE_COLORS: Record<string, string> = {
  narrative_leadership: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  power_building: 'bg-green-500/20 text-green-300 border-green-500/50',
  agitation: 'bg-red-500/20 text-red-300 border-red-500/50',
  audience_growth: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  morale: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
};

const URGENCY_LABELS: Record<string, string> = {
  immediate: 'Immediate',
  today: 'Today',
  this_week: 'This Week',
  evergreen: 'Evergreen',
};

export function StoryCard({
  id,
  title,
  source,
  summary,
  framingAdvice,
  strategicValue,
  relevanceScore,
  timeUrgency,
  suggestedWriter,
  url,
  onMarkCovered,
  onSkip,
}: StoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const handleMarkCovered = async () => {
    if (!onMarkCovered) return;
    setIsActioning(true);
    try {
      await onMarkCovered(id);
    } finally {
      setIsActioning(false);
    }
  };

  const handleSkip = async () => {
    if (!onSkip) return;
    setIsActioning(true);
    try {
      await onSkip(id);
    } finally {
      setIsActioning(false);
    }
  };

  const valueColor =
    STRATEGIC_VALUE_COLORS[strategicValue] ||
    'bg-gray-500/20 text-gray-300 border-gray-500/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden hover:border-ida-blue/50 transition-colors"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-dark-elevated transition-colors"
      >
        <div className="flex items-start gap-3 mb-2">
          {/* Relevance score badge */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-ida-amber/20 text-ida-amber text-sm font-bold">
            {relevanceScore}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark-text-primary line-clamp-2 mb-1">
              {title}
            </h3>
            <p className="text-xs text-dark-text-muted">{source}</p>
          </div>

          {/* Expand indicator */}
          <div className="flex-shrink-0">
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              className="text-dark-text-secondary"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <polyline points="6 9 10 13 14 9"></polyline>
            </motion.svg>
          </div>
        </div>

        {/* Quick info row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded border ${valueColor}`}
          >
            {strategicValue.replace(/_/g, ' ')}
          </span>
          <span className="text-xs text-dark-text-muted">
            {URGENCY_LABELS[timeUrgency]}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden border-t border-dark-border"
      >
        <div className="p-4 space-y-4">
          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold text-dark-text-secondary mb-1 uppercase tracking-wide">
              Summary
            </h4>
            <p className="text-sm text-dark-text-primary leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Framing advice */}
          <div>
            <h4 className="text-xs font-semibold text-dark-text-secondary mb-1 uppercase tracking-wide">
              Framing Advice
            </h4>
            <p className="text-sm text-dark-text-primary leading-relaxed">
              {framingAdvice}
            </p>
          </div>

          {/* Suggested writer */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wide">
              Writer:
            </span>
            <span className="text-sm text-ida-amber">{suggestedWriter}</span>
          </div>

          {/* Links */}
          <div className="flex gap-2 pt-2 border-t border-dark-border">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-2 text-xs font-medium bg-dark-elevated hover:bg-ida-amber/20 text-ida-blue hover:text-ida-amber rounded transition-colors"
            >
              Read Source
            </a>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-dark-border">
            <button
              onClick={handleMarkCovered}
              disabled={isActioning}
              className="flex-1 px-3 py-2 text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 rounded transition-colors disabled:opacity-50"
            >
              ✓ Covered
            </button>
            <button
              onClick={handleSkip}
              disabled={isActioning}
              className="flex-1 px-3 py-2 text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded transition-colors disabled:opacity-50"
            >
              Skip
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
