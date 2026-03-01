'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AvatarState =
  | 'idle'
  | 'listening'
  | 'scanning'
  | 'thinking'
  | 'alert'
  | 'complete';

interface AvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ state = 'idle', size = 'md' }: AvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const viewBoxSize = 100;
  const dimension = sizeMap[size];

  // Get colors based on state
  const getColors = () => {
    switch (state) {
      case 'idle':
        return { iris: '#E8A43A', glow: '#E8A43A' };
      case 'listening':
        return { iris: '#E8A43A', glow: '#E8D43A' };
      case 'scanning':
        return { iris: '#3A8AE8', glow: '#3A8AE8' };
      case 'thinking':
        return { iris: '#8A3AE8', glow: '#8A3AE8' };
      case 'alert':
        return { iris: '#E84A3A', glow: '#E84A3A' };
      case 'complete':
        return { iris: '#3AE87A', glow: '#3AE87A' };
      default:
        return { iris: '#E8A43A', glow: '#E8A43A' };
    }
  };

  const colors = getColors();

  // Animation variants
  const irisVariants = {
    idle: {
      cx: 50,
      opacity: 1,
    },
    listening: {
      cx: [50, 52, 48, 50],
      opacity: 1,
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    scanning: {
      cx: [30, 70, 30],
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
    thinking: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
    alert: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.9, 1],
      transition: {
        duration: 0.4,
        repeat: Infinity,
      },
    },
    complete: {
      scale: [1, 0.9, 1],
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: 0,
      },
    },
  };

  const glowVariants = {
    idle: {
      opacity: 0.3,
      r: 40,
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    listening: {
      opacity: [0.4, 0.6, 0.4],
      r: [38, 42, 38],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    scanning: {
      opacity: [0.2, 0.5, 0.2],
      r: [35, 45, 35],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
    thinking: {
      opacity: [0.3, 0.5, 0.3],
      r: [38, 42, 38],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
    alert: {
      opacity: [0.5, 0.8, 0.5],
      r: [40, 45, 40],
      transition: {
        duration: 0.4,
        repeat: Infinity,
      },
    },
    complete: {
      opacity: [0.5, 0],
      r: [40, 50],
      transition: {
        duration: 0.6,
        repeat: 0,
      },
    },
  };

  // Eyelid animation for blink
  const eyelidVariants = {
    open: {
      yOpen: 25,
      yClose: 50,
    },
    blink: {
      yOpen: [25, 50, 25],
      yClose: [50, 25, 50],
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.svg
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className="drop-shadow-lg"
      initial={state}
      animate={state}
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodOpacity="0.3"
          />
        </filter>
      </defs>

      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke={colors.glow}
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* Glow effect */}
      <motion.circle
        cx="50"
        cy="50"
        variants={glowVariants}
        fill="none"
        stroke={colors.glow}
        strokeWidth="1"
      />

      {/* Eye white (sclera) */}
      <ellipse
        cx="50"
        cy="50"
        rx="35"
        ry="38"
        fill="#1A1A25"
        stroke={colors.glow}
        strokeWidth="0.5"
      />

      {/* Iris */}
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        fill={colors.iris}
        variants={irisVariants}
        filter="url(#shadow)"
      />

      {/* Pupil */}
      <motion.circle
        cx="50"
        cy="50"
        r="12"
        fill="#0A0A0F"
        variants={irisVariants}
      />

      {/* Highlight for depth */}
      <motion.circle
        cx="47"
        cy="47"
        r="4"
        fill="white"
        opacity="0.6"
        variants={irisVariants}
      />

      {/* Scanning line (appears during scanning state) */
      {state === 'scanning' && (
        <motion.line
          x1="20"
          y1="50"
          x2="80"
          y2="50"
          stroke={colors.iris}
          strokeWidth="1"
          opacity="0.5"
          animate={{
            x1: [20, 80],
            x2: [80, 20],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      )}

      {/* Upper eyelid */}
      <motion.path
        d="M 15 50 Q 50 25 85 50"
        fill="none"
        stroke={colors.glow}
        strokeWidth="2"
        opacity="0.3"
      />

      {/* Lower eyelid */}
      <motion.path
        d="M 15 50 Q 50 75 85 50"
        fill="none"
        stroke={colors.glow}
        strokeWidth="2"
        opacity="0.3"
      />
    </motion.svg>
  );
}
