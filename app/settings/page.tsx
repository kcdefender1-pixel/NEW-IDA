'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Source {
  id: string;
  name: string;
  url: string;
  type: string;
  category: string;
  active: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSource, setNewSource] = useState({
    name: '',
    url: '',
    type: 'rss',
    category: 'mainstream',
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sources');
      if (!response.ok) throw new Error('Failed to fetch sources');
      const data = await response.json();
      setSources(data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSource = async (id: string, active: boolean) => {
    try {
      const response = await fetch('/api/sources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !active }),
      });

      if (!response.ok) throw new Error('Failed to update source');
      await fetchSources();
    } catch (error) {
      console.error('Error updating source:', error);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;

    try {
      const response = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource),
      });

      if (!response.ok) throw new Error('Failed to add source');

      setNewSource({
        name: '',
        url: '',
        type: 'rss',
        category: 'mainstream',
      });
      setIsAdding(false);
      await fetchSources();
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;

    try {
      const response = await fetch('/api/sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete source');
      await fetchSources();
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-surface border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ida-amber">IDA Settings</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-dark-elevated hover:bg-dark-border text-dark-text-secondary hover:text-dark-text-primary rounded-lg transition-colors"
          >
            ← Back to IDA
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* News Sources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">News Sources</h2>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 bg-ida-amber text-dark-bg rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              {isAdding ? 'Cancel' : '+ Add Source'}
            </button>
          </div>

          {/* Add Source Form */}
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddSource}
              className="mb-6 p-4 bg-dark-surface rounded-lg border border-dark-border space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  Source Name
                </label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={(e) =>
                    setNewSource({ ...newSource, name: e.target.value })
                  }
                  placeholder="e.g., Kansas City Star"
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-ida-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={newSource.url}
                  onChange={(e) =>
                    setNewSource({ ...newSource, url: e.target.value })
                  }
                  placeholder="https://example.com/feed/"
                  className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:border-ida-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Type
                  </label>
                  <select
                    value={newSource.type}
                    onChange={(e) =>
                      setNewSource({ ...newSource, type: e.target.value })
                    }
                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text-primary focus:outline-none focus:border-ida-blue"
                  >
                    <option value="rss">RSS Feed</option>
                    <option value="web">Web</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Category
                  </label>
                  <select
                    value={newSource.category}
                    onChange={(e) =>
                      setNewSource({ ...newSource, category: e.target.value })
                    }
                    className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text-primary focus:outline-none focus:border-ida-blue"
                  >
                    <option value="mainstream">Mainstream</option>
                    <option value="community">Community</option>
                    <option value="government">Government</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-ida-green text-dark-bg rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Add Source
              </button>
            </motion.form>
          )}

          {/* Sources List */}
          {isLoading ? (
            <div className="text-center py-8 text-dark-text-muted">
              Loading sources...
            </div>
          ) : (
            <div className="space-y-2">
              {sources.map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 p-4 bg-dark-surface border border-dark-border rounded-lg hover:border-ida-blue/50 transition-colors"
                >
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggleSource(source.id, source.active)}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      source.active
                        ? 'bg-ida-green/20 text-ida-green'
                        : 'bg-dark-elevated text-dark-text-muted'
                    }`}
                  >
                    {source.active ? '✓' : '○'}
                  </button>

                  {/* Source info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark-text-primary">
                      {source.name}
                    </h3>
                    <p className="text-xs text-dark-text-muted truncate">
                      {source.url}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-dark-elevated rounded text-dark-text-secondary">
                        {source.type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-dark-elevated rounded text-dark-text-secondary">
                        {source.category}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="px-3 py-2 text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded transition-colors"
                  >
                    Delete
                  </button>
                </motion.div>
              ))}

              {sources.length === 0 && (
                <div className="text-center py-8 text-dark-text-muted">
                  No sources configured yet. Add one to get started.
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-dark-surface rounded-lg border border-dark-border"
        >
          <h3 className="font-semibold text-dark-text-primary mb-4">
            Source Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-dark-text-muted text-sm">Total Sources</p>
              <p className="text-2xl font-bold text-ida-amber">{sources.length}</p>
            </div>
            <div>
              <p className="text-dark-text-muted text-sm">Active</p>
              <p className="text-2xl font-bold text-ida-green">
                {sources.filter((s) => s.active).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
