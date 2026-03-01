import prisma from './prisma';
import { scrapeAllSources } from './scraper';
import { analyzeStory, generateBrief, StoryAnalysis } from './claude';

export interface ScanProgress {
  status: 'scanning' | 'analyzing' | 'complete' | 'error';
  currentSource?: string;
  storyCount: number;
  message: string;
}

export interface AnalysisResult {
  scanId: string;
  stories: Array<{
    id: string;
    title: string;
    url: string;
    analysis: StoryAnalysis;
  }>;
  briefText: string;
}

export async function performScan(
  focus?: 'all' | 'police' | 'organizing' | 'troost' | 'economy'
): Promise<AnalysisResult> {
  // Create initial scan record
  const scan = await prisma.scan.create({
    data: {
      status: 'scanning',
    },
  });

  try {
    // Fetch all active sources
    let sources = await prisma.source.findMany({
      where: { active: true },
    });

    // Filter by focus if specified
    if (focus === 'police') {
      sources = sources.filter(
        (s) =>
          s.name.toLowerCase().includes('kcpd') ||
          s.category === 'government'
      );
    } else if (focus === 'organizing') {
      sources = sources.filter((s) => s.category === 'community');
    } else if (focus === 'troost') {
      sources = sources.filter(
        (s) =>
          s.name.toLowerCase().includes('troost') ||
          s.category === 'community'
      );
    } else if (focus === 'economy') {
      sources = sources.filter(
        (s) =>
          s.category === 'community' ||
          s.name.toLowerCase().includes('economic')
      );
    }

    // Scrape all sources
    const scrapedStories = await scrapeAllSources(sources);

    // Deduplicate against existing stories
    const existingUrls = new Set(
      (await prisma.story.findMany({ select: { url: true } })).map(
        (s) => s.url
      )
    );

    const newStories = scrapedStories.filter((s) => !existingUrls.has(s.url));

    // Update scan with story count
    await prisma.scan.update({
      where: { id: scan.id },
      data: { storyCount: newStories.length, status: 'analyzing' },
    });

    // Analyze each story and store
    const analyzedStories = [];

    for (const scrapedStory of newStories) {
      try {
        const analysis = await analyzeStory(scrapedStory.rawContent);

        const storedStory = await prisma.story.create({
          data: {
            scanId: scan.id,
            title: scrapedStory.title,
            url: scrapedStory.url,
            source: scrapedStory.source,
            sourceType: scrapedStory.sourceType,
            rawContent: scrapedStory.rawContent,
            publishedAt: scrapedStory.publishedAt,
            summary: analysis.summary,
            strategicValue: analysis.strategicValue,
            relevanceScore: analysis.relevanceScore,
            abolitionistAngle: analysis.abolitionistAngle,
            framingAdvice: analysis.framingAdvice,
            competitiveEdge: analysis.competitiveEdge,
            timeUrgency: analysis.timeUrgency,
            suggestedWriter: analysis.suggestedWriter,
            tags: analysis.tags.join(','),
            patternLinks: analysis.patternNote,
          },
        });

        analyzedStories.push({
          id: storedStory.id,
          title: storedStory.title,
          url: storedStory.url,
          analysis,
        });
      } catch (error) {
        console.error(`Error analyzing story ${scrapedStory.title}:`, error);
      }
    }

    // Generate brief
    const briefInput = analyzedStories.map((s) => ({
      title: s.title,
      source: newStories.find((n) => n.title === s.title)?.source || '',
      summary: s.analysis.summary,
      strategicValue: s.analysis.strategicValue,
      relevanceScore: s.analysis.relevanceScore,
      framingAdvice: s.analysis.framingAdvice,
      suggestedWriter: s.analysis.suggestedWriter,
    }));

    const briefText = await generateBrief({ stories: briefInput });

    // Update scan with brief and mark complete
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: 'complete',
        briefText,
      },
    });

    return {
      scanId: scan.id,
      stories: analyzedStories,
      briefText,
    };
  } catch (error) {
    // Update scan with error status
    await prisma.scan.update({
      where: { id: scan.id },
      data: { status: 'error' },
    });
    throw error;
  }
}

export async function getScanStatus(
  scanId: string
): Promise<{
  id: string;
  status: string;
  storyCount: number;
  briefText: string | null;
}> {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
  });

  if (!scan) {
    throw new Error('Scan not found');
  }

  return {
    id: scan.id,
    status: scan.status,
    storyCount: scan.storyCount,
    briefText: scan.briefText,
  };
}

export async function getStoriesForScan(scanId: string) {
  const stories = await prisma.story.findMany({
    where: { scanId },
    orderBy: { relevanceScore: 'desc' },
  });

  // Calculate patterns from tags
  const tagCounts: Record<string, number> = {};
  stories.forEach((story) => {
    if (story.tags) {
      story.tags.split(',').forEach((tag) => {
        tagCounts[tag.trim()] = (tagCounts[tag.trim()] || 0) + 1;
      });
    }
  });

  const patterns = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({
      tag,
      count,
      trend: 'stable' as const,
    }));

  return { stories, patterns };
}
