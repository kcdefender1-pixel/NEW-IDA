'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StoryCard } from './StoryCard';

interface Story {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string | null;
  framingAdvice: string | null;
  strategicValue: string | null;
  relevanceScore: number | null;
  timeUrgency: string | null;
  suggestedWriter: string | null;
  publishedAt: Date | null;
}

interface StoryListProps {
  stories: Story[];
  onMarkCovered?: (id: string) => Promise<void>;
  onSkip?: (id: string) => Promise<void>;
}

export function StoryList({
  stories,
  onMarkCovered,
  onSkip,
}: StoryListProps) {
  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-dark-text-muted">
        <p className="text-sm">No stories found. Run a scan to discover editorial opportunities.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 p-4"
    >
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <StoryCard
            id={story.id}
            title={story.title}
            source={story.source}
            summary={story.summary || ''}
            framingAdvice={story.framingAdvice || ''}
            strategicValue={story.strategicValue || 'narrative_leadership'}
            relevanceScore={story.relevanceScore || 0}
            timeUrgency={story.timeUrgency || 'evergreen'}
            suggestedWriter={story.suggestedWriter || 'General'}
            url={story.url}
            onMarkCovered={onMarkCovered}
            onSkip={onSkip}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
