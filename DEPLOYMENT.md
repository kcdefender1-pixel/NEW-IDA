# IDA Deployment Guide

## Overview

IDA is now fully built and ready for deployment. This guide covers everything needed to get IDA running in development or production.

## Prerequisites

- Node.js 18+ (18.17 or newer)
- npm 9+
- Anthropic API key (for Claude access)

## Development Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd NEW-IDA
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
DATABASE_URL="file:./prisma/ida.db"
NEXT_PUBLIC_APP_NAME="IDA"
```

### 3. Initialize Database

```bash
npm run prisma:migrate
npm run prisma:seed
```

This creates the SQLite database and seeds it with 11 news sources.

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see:
- IDA avatar with time-aware greeting
- Scan buttons on the right panel
- Settings gear icon in the header

## Key Features Ready

✅ **Full-Stack Next.js Application**
- API routes for scanning, chat, stories, and source management
- SQLite database with Prisma ORM
- Real-time UI updates with Framer Motion

✅ **Editorial Intelligence Engine**
- Claude Sonnet integration for story analysis
- Abolitionist framing and power-building evaluation
- Automated brief generation
- Conversational chat interface

✅ **News Scanning System**
- RSS feed parsing from 11+ configured sources
- Web content extraction
- Story deduplication
- Pattern detection across stories

✅ **User Interface**
- Dark theme optimized for late-night newsroom work
- Animated avatar with 6 states
- Two-panel layout (chat + stories)
- Story cards with detailed analysis
- Settings page for source management
- Real-time status indicators

✅ **Database & Persistence**
- Story archive with full analysis
- Scan history
- Chat conversation history
- Configurable news sources
- Team coverage tracking

## Testing the Application

### 1. Run a Scan

1. Open http://localhost:3000
2. Click "Scan Everything" or a focused scan button
3. Watch the scan narration in real-time
4. Stories populate the right panel as they're analyzed
5. Read IDA's conversational brief at the top

### 2. Ask IDA Questions

1. Type a question in the chat input
2. Examples:
   - "What's our competitive advantage on this story?"
   - "Tell me more about the police accountability patterns"
   - "What should we cover that mainstream missed?"
3. IDA responds with context-aware editorial advice

### 3. Manage News Sources

1. Click the settings gear icon (top right)
2. Add new sources or toggle existing ones
3. Source management is persistent
4. Changes take effect on next scan

## Deploying to Production

### Option 1: Vercel (Recommended for Now)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - ANTHROPIC_API_KEY
# - DATABASE_URL
```

**Note:** Vercel's serverless platform limits file-based SQLite. For production at scale, migrate to PostgreSQL:

```bash
# Update DATABASE_URL in Vercel to point to PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/ida"

# Migrate your schema
npm run prisma:migrate deploy
```

### Option 2: Railway

1. Connect your GitHub repo to Railway
2. Railway automatically detects Next.js
3. Add environment variables in Railway dashboard
4. Deploy

Railway supports file-based SQLite out of the box.

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t ida .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=$KEY ida
```

## Production Checklist

- [ ] API key is secure (use environment variables, not committed)
- [ ] Database is backed up regularly
- [ ] Next.js build completes without errors
- [ ] All API routes return proper error messages
- [ ] Settings page allows team to manage sources
- [ ] Chat history persists across sessions
- [ ] Scans complete without errors
- [ ] Avatar states work correctly
- [ ] Mobile layout is responsive
- [ ] SSL/TLS is enabled (if hosted online)

## Monitoring & Troubleshooting

### Check API Connectivity

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"focus": "all"}'
```

### Database Debugging

```bash
# Open Prisma Studio
npx prisma studio

# Check database contents
npx prisma db push --accept-data-loss
```

### View Logs

```bash
# Development
npm run dev  # Check console output

# Production (Vercel)
vercel logs

# Production (Railway)
railway logs
```

### Common Issues

**"API key not set"**
- Ensure `ANTHROPIC_API_KEY` is in `.env`
- Restart dev server after changing

**"Database not found"**
- Run `npm run prisma:migrate`
- Check `DATABASE_URL` in `.env`

**"Stories not appearing"**
- Check news sources are active in `/settings`
- Verify API response: `curl http://localhost:3000/api/stories?scanId=xxx`

**"Chat not working"**
- Verify API key is valid
- Check Claude API rate limits
- Review Claude response format in logs

## Architecture Decisions

### Why SQLite?
- Zero-config database perfect for v1
- Works great with Vercel's file storage
- Easy to migrate to PostgreSQL later
- Sufficient for ~14 person team

### Why Sonnet (not Haiku)?
- Editorial analysis requires nuanced understanding
- Power-building frameworks need sophisticated reasoning
- Cost-effective at current scale (~$0.10-0.20 per scan)

### Why Next.js?
- Full-stack in one framework
- Server components optimize data fetching
- API routes eliminate separate backend
- Built-in caching and optimization

## What's Next?

### Phase 4 Improvements (Future)

- [ ] Background scanning with cron jobs
- [ ] Real-time streaming responses with SSE
- [ ] Email/Slack briefing delivery
- [ ] Multi-language support
- [ ] Editorial calendar integration
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Social media monitoring (Twitter/X API)
- [ ] Advanced pattern detection
- [ ] Predictive story alerts

### Performance Optimizations

- [ ] Database query optimization
- [ ] Response caching
- [ ] Image optimization
- [ ] Code splitting
- [ ] CDN for static assets

## Support & Feedback

- Issues? Check the GitHub issues
- Feature requests? Add to Discussions
- Questions? Check README.md for architecture details

---

**IDA is ready for The Kansas City Defender newsroom!**

Built with ❤️ for liberation, power-building, and fierce journalism.
