'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { StatusBar } from './StatusBar';
import { ChatPanel } from './ChatPanel';
import { StoryList } from './StoryList';
import { SCAN_NARRATION } from '@/lib/prompts';

type AvatarState =
  | 'idle'
  | 'listening'
  | 'scanning'
  | 'thinking'
  | 'alert'
  | 'complete';

interface Message {
  id: string;
  role: 'user' | 'ida';
  content: string;
}

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

export function IDAInterface() {
  const [status, setStatus] = useState<AvatarState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  // Load greeting on mount
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = '';

    if (hour < 12) {
      greetingText = 'Good morning. Ready to see what\'s moving in Kansas City today?';
    } else if (hour < 17) {
      greetingText = 'Good afternoon. Let me catch you up on what\'s developing.';
    } else if (hour < 21) {
      greetingText = 'Evening. Let\'s see what happened while they weren\'t watching.';
    } else {
      greetingText = 'Still at it? Let\'s find something worth your time.';
    }

    // Add greeting as initial message
    setMessages([{
      id: `greeting-${Date.now()}`,
      role: 'ida',
      content: greetingText,
    }]);
  }, []);

  const handleScan = useCallback(
    async (focus: 'all' | 'police' | 'organizing' | 'troost' | 'economy' = 'all') => {
      if (isLoading) return; // Prevent multiple concurrent scans

      setStatus('scanning');
      setMessages([]); // Clear previous messages
      setIsLoading(true);
      setHasScanned(true);

      try {
        // Simulate scan narration
        const narrationMessages = [
          SCAN_NARRATION.start,
          SCAN_NARRATION.sourceCheck('Kansas City Star'),
          SCAN_NARRATION.sourceCheck('KCUR'),
          SCAN_NARRATION.sourceCheck('KC Tenants'),
          SCAN_NARRATION.analyzing,
        ];

        for (const narration of narrationMessages) {
          setMessages((prev) => [
            ...prev,
            {
              id: `scan-${Date.now()}-${Math.random()}`,
              role: 'ida',
              content: narration,
            },
          ]);
          await new Promise((resolve) => setTimeout(resolve, 600));
        }

        // Perform actual scan
        setStatus('thinking');
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ focus }),
        });

        if (!response.ok) {
          throw new Error(`Scan failed: ${response.statusText}`);
        }
        const scanData = await response.json();

        setCurrentScanId(scanData.scanId);

        // Fetch stories for this scan
        const storiesResponse = await fetch(
          `/api/stories?scanId=${scanData.scanId}`
        );
        if (!storiesResponse.ok) {
          throw new Error('Failed to fetch stories');
        }
        const storiesData = await storiesResponse.json();
        setStories(storiesData.stories || []);

        // Add brief to messages
        setMessages((prev) => [
          ...prev,
          {
            id: `brief-${Date.now()}`,
            role: 'ida',
            content: scanData.briefText || 'Brief generated successfully.',
          },
        ]);

        setStatus('complete');
      } catch (error) {
        console.error('Scan error:', error);
        setStatus('alert');
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'ida',
            content: `I encountered an issue during the scan: ${errorMessage}. Please check your API key and try again.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
      };
      setMessages((prev) => [...prev, userMessage]);
      setStatus('thinking');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            scanId: currentScanId,
            history: messages,
          }),
        });

        if (!response.ok) throw new Error('Chat failed');
        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: `ida-${Date.now()}`,
            role: 'ida',
            content: data.response,
          },
        ]);
        setStatus('idle');
      } catch (error) {
        console.error('Chat error:', error);
        setStatus('alert');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, currentScanId]
  );

  const handleMarkCovered = useCallback(async (storyId: string) => {
    try {
      await fetch('/api/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, covered: true }),
      });

      setStories((prev) =>
        prev.map((s) =>
          s.id === storyId ? { ...s } : s
        )
      );
    } catch (error) {
      console.error('Error marking story as covered:', error);
    }
  }, []);

  const handleSkip = useCallback(async (storyId: string) => {
    try {
      await fetch('/api/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, skipped: true }),
      });

      setStories((prev) => prev.filter((s) => s.id !== storyId));
    } catch (error) {
      console.error('Error skipping story:', error);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-dark-bg">
      {/* Status bar */}
      <StatusBar status={status} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel - left side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col border-r border-dark-border max-w-md"
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Stories panel - right side */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col overflow-hidden bg-dark-surface"
        >
          {/* Action buttons at top */}
          {!hasScanned && (
            <div className="p-4 border-b border-dark-border space-y-2">
              <button
                onClick={() => handleScan('all')}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-ida-amber text-dark-bg rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Scanning...' : 'Scan Everything'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleScan('police')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-ida-red/20 text-ida-red rounded-lg hover:bg-ida-red/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Focus: Police
                </button>
                <button
                  onClick={() => handleScan('organizing')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-ida-green/20 text-ida-green rounded-lg hover:bg-ida-green/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                >
                  Focus: Organizing
                </button>
              </div>
              <button
                onClick={() => handleScan('all')}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-dark-elevated hover:bg-dark-border text-dark-text-secondary hover:text-dark-text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
              >
                New Scan
              </button>
            </div>
          )}

          {/* Rescan button if scan has been done */}
          {hasScanned && !isLoading && (
            <div className="p-2 border-b border-dark-border">
              <button
                onClick={() => {
                  setHasScanned(false);
                  setStories([]);
                  setCurrentScanId(null);
                }}
                className="w-full px-3 py-2 text-xs text-dark-text-secondary hover:text-ida-amber transition-colors"
              >
                ← Back to scan options
              </button>
            </div>
          )}

          {/* Stories list */}
          <div className="flex-1 overflow-y-auto">
            <StoryList
              stories={stories}
              onMarkCovered={handleMarkCovered}
              onSkip={handleSkip}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
