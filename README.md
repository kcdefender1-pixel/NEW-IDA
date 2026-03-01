# IDA: Intelligence for the Defender's Advantage

An AI-powered editorial intelligence agent for The Kansas City Defender, a radical abolitionist Black nonprofit media organization.

## What is IDA?

IDA scans the Kansas City information landscape, analyzes everything through an abolitionist and power-building lens, and delivers strategic editorial briefings to the newsroom team. She watches the information battlefield, identifies editorial opportunities, detects patterns in state violence and community resistance, and briefs the team like a revolutionary research partner.

IDA is not a dashboard. She is not a news aggregator. She is a conversational intelligence agent who gets smarter with every scan.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- An Anthropic API key for Claude access

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd NEW-IDA
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-xxx...
DATABASE_URL="file:./prisma/ida.db"
```

4. Initialize the database:
```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Full-stack React with API routes |
| **Styling** | Tailwind CSS | Dark theme UI development |
| **Animation** | Framer Motion | IDA avatar states and transitions |
| **Database** | SQLite + Prisma | File-based, zero-config persistence |
| **AI Engine** | Claude Sonnet API | Editorial analysis and briefing |
| **News Ingestion** | RSS Parser + fetch | Pull from configured news sources |

### Key Components

#### Backend
- **API Routes**: `/api/scan`, `/api/stories`, `/api/chat`, `/api/sources`
- **Database Models**: Scan, Story, Source, ChatMessage
- **Claude Integration**: Analysis, brief generation, conversational responses
- **News Scraper**: RSS feeds + web content fetching

#### Frontend
- **Avatar**: Animated eye with 6 states (idle, listening, scanning, thinking, alert, complete)
- **ChatPanel**: Conversational interface for IDA briefings and follow-up questions
- **StoryCards**: Individual stories with IDA's analysis and action buttons
- **StatusBar**: Real-time status indicator with avatar
- **IDAInterface**: Main orchestrator tying all components together

## Project Structure

```
.
├── app/
│   ├── api/                    # API routes
│   │   ├── scan/route.ts      # Trigger and check scan status
│   │   ├── stories/route.ts   # Retrieve and update stories
│   │   ├── chat/route.ts      # Chat with IDA
│   │   └── sources/route.ts   # Manage news sources
│   ├── globals.css            # Global styles and animations
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main app page
├── components/
│   └── ida/                    # IDA-specific components
│       ├── Avatar.tsx         # Animated avatar icon
│       ├── ChatPanel.tsx      # Chat interface
│       ├── ChatMessage.tsx    # Individual message
│       ├── StoryCard.tsx      # Story card with analysis
│       ├── StoryList.tsx      # List of stories
│       ├── StatusBar.tsx      # Status header
│       ├── BriefView.tsx      # Editorial brief display
│       ├── ScanProgress.tsx   # Scan narration
│       └── IDAInterface.tsx   # Main interface controller
├── lib/
│   ├── claude.ts              # Claude API wrapper
│   ├── scraper.ts             # News source scraper
│   ├── analyzer.ts            # Orchestration logic
│   ├── prisma.ts              # Database client
│   └── prompts.ts             # System prompts and utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Database seeder
│   └── migrations/            # Database migrations
└── public/                     # Static assets (if needed)
```

## How It Works

### The Scan Flow

1. **User initiates scan** → Choose "Scan Everything" or focused scan (Police, Organizing, Troost)
2. **System scrapes sources** → Fetches RSS feeds and web content from 11+ news sources
3. **Claude analyzes stories** → Each story evaluated through abolitionist lens, scored 1-100
4. **Stories stored** → Analysis saved to database, linked to scan
5. **Brief generated** → Claude writes conversational editorial brief for team
6. **Stories displayed** → Team browses stories with IDA's framing advice and suggestions

### The Chat Flow

1. **User asks question** → "What's our coverage gap?" or "Tell me more about the tenant story"
2. **IDA responds** → Uses current scan context + conversation history
3. **Messages persist** → Chat history stored in database for continuity

### Avatar States

The animated eye communicates IDA's state:

- **IDLE** (amber): Waiting, ready to scan
- **LISTENING** (amber, brightened): Paying attention to user input
- **SCANNING** (electric blue): Processing sources and analyzing stories
- **THINKING** (blue-purple): Generating brief or response
- **ALERT** (red): Error or critical information
- **COMPLETE** (green): Scan finished, brief ready

## Database Schema

### Scan
Represents a single intelligence sweep session.

```typescript
model Scan {
  id: string          // Unique identifier
  createdAt: DateTime // When scan occurred
  status: string      // pending, scanning, analyzing, complete, error
  briefText: string   // Generated editorial brief
  storyCount: int     // Number of stories found
  stories: Story[]    // Related stories
}
```

### Story
Individual news story with IDA's editorial analysis.

```typescript
model Story {
  id: string
  scanId: string
  title: string
  url: string
  source: string          // "KC Star", "KCUR", etc.
  sourceType: string      // "mainstream", "community", "government"
  rawContent: string      // Original text/snippet
  publishedAt: DateTime

  // IDA's analysis
  summary: string
  strategicValue: string  // narrative_leadership, power_building, agitation, audience_growth, morale
  relevanceScore: int     // 1-100
  abolitionistAngle: string
  framingAdvice: string
  competitiveEdge: string
  timeUrgency: string     // immediate, today, this_week, evergreen
  suggestedWriter: string

  // Team tracking
  covered: boolean
  skipped: boolean
  notes: string
  tags: string            // Comma-separated: "kcpd,violence,pattern"
}
```

### Source
Configured news source for scanning.

```typescript
model Source {
  id: string
  name: string        // "Kansas City Star"
  url: string         // RSS URL or web address
  type: string        // "rss", "web", "twitter", "government"
  category: string    // "mainstream", "community", "government"
  active: boolean
  lastScanned: DateTime
}
```

## System Prompts

IDA operates with three distinct Claude system prompts:

### 1. Story Analysis
Evaluates individual stories through the lens of:
- The Defender's 5 power-building pillars
- Kansas City's racial geography and redlining history
- State violence and community resistance
- Narrative opportunities and competitive advantages

### 2. Brief Generation
Writes conversational editorial briefings that:
- Lead with the most important editorial opportunity
- Connect stories to systemic patterns
- Frame urgency as opportunity, not anxiety
- Assign stories to team members

### 3. Chat Interface
Answers team questions about:
- Story details and framing angles
- Pattern analysis across time
- Editorial strategy and timing
- Coverage gaps and opportunities

## API Reference

### POST /api/scan
Trigger a new intelligence scan.

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"focus": "all"}'

# Response
{
  "scanId": "cuid123...",
  "status": "complete",
  "storyCount": 15,
  "briefText": "Good morning..."
}
```

### GET /api/scan?id=scanId
Check scan status.

```bash
curl http://localhost:3000/api/scan?id=cuid123
```

### GET /api/stories?scanId=scanId
Retrieve stories from a scan.

```bash
curl http://localhost:3000/api/stories?scanId=cuid123
```

### PATCH /api/stories
Mark story as covered or skip it.

```bash
curl -X PATCH http://localhost:3000/api/stories \
  -H "Content-Type: application/json" \
  -d '{"storyId": "id", "covered": true}'
```

### POST /api/chat
Send message to IDA.

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What should we cover about police?",
    "scanId": "cuid123",
    "history": []
  }'

# Response
{
  "response": "IDA's response...",
  "role": "ida"
}
```

### GET /api/sources
List all configured news sources.

### POST /api/sources
Add a new news source.

### PATCH /api/sources
Toggle source active status.

## Development

### Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...        # Your Claude API key
DATABASE_URL="file:./prisma/ida.db" # SQLite database path
NEXT_PUBLIC_APP_NAME="IDA"          # App name for UI
```

### Database Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Seed with initial sources
npm run prisma:seed
```

### Development Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

Note: Vercel doesn't support persistent file-based SQLite for long-running processes. For production, consider migrating to PostgreSQL with Prisma or using a different deployment platform.

### Railway / Other Platforms

1. Connect your GitHub repo
2. Set environment variables
3. Railway will auto-detect Next.js and deploy
4. SQLite file will persist in the container

### Self-Hosted

```bash
npm run build
npm start
```

## Roadmap

### Phase 1 ✅
- [x] Core Next.js setup
- [x] Database and schema
- [x] Claude API integration
- [x] News scraper
- [x] API routes
- [x] UI components
- [x] Two-panel interface

### Phase 2 (In Progress)
- [ ] Chat streaming (Server-Sent Events)
- [ ] Mobile responsiveness
- [ ] Settings/sources management page
- [ ] Background scanning (cron jobs)
- [ ] Pattern detection across scans
- [ ] Memory system for team preferences

### Phase 3 (Future)
- [ ] Social media monitoring (Twitter/X, Instagram)
- [ ] Multi-language support
- [ ] Export briefings as email/PDF
- [ ] Team collaboration features
- [ ] Editorial calendar integration
- [ ] Analytics dashboard

## Contributing

This is the editorial intelligence agent for The Kansas City Defender. Contributions should align with the organization's abolitionist mission and power-building framework.

## License

All rights reserved. Created for The Kansas City Defender.

## Credits

Named for **Ida B. Wells**, fearless journalist and anti-lynching activist who set the gold standard for investigative journalism rooted in the liberation of Black people.

---

**Built for The Kansas City Defender** — Covering power, resistance, and liberation in Kansas City.
