import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ida: {
          // IDA Brand Colors
          amber: '#E8A43A',
          blue: '#3A8AE8',
          red: '#E84A3A',
          green: '#3AE87A',
          purple: '#8A3AE8',
          gold: '#E8C83A',
        },
        dark: {
          bg: '#0A0A0F',
          surface: '#12121A',
          elevated: '#1A1A25',
          border: '#2A2A35',
          text: {
            primary: '#E8E8ED',
            secondary: '#8888A0',
            muted: '#55556A',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
