import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'fullContent'],
      ['media:content', 'mediaContent'],
    ],
  },
});

export interface ScrapedStory {
  title: string;
  url: string;
  source: string;
  sourceType: string;
  rawContent: string;
  publishedAt: Date | null;
}

export async function fetchRSSFeed(
  url: string,
  sourceName: string,
  sourceType: string
): Promise<ScrapedStory[]> {
  try {
    const feed = await parser.parseURL(url);

    return (feed.items || [])
      .slice(0, 10) // Limit to 10 most recent items per source
      .map((item) => ({
        title: item.title || 'Untitled',
        url: item.link || '',
        source: sourceName,
        sourceType: sourceType,
        rawContent: item.content || item.summary || item.fullContent || '',
        publishedAt: item.pubDate ? new Date(item.pubDate) : null,
      }))
      .filter((story) => story.url && story.rawContent);
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return [];
  }
}

export async function fetchWebContent(
  url: string,
  sourceName: string,
  sourceType: string
): Promise<ScrapedStory[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Basic extraction: look for og:title and og:description meta tags
    // In production, this would use a proper HTML parser
    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const descriptionMatch = html.match(
      /<meta property="og:description" content="([^"]+)"/
    );

    const title = titleMatch ? titleMatch[1] : sourceName;
    const content = descriptionMatch
      ? descriptionMatch[1]
      : 'Content retrieved from website';

    if (!title || !content) {
      return [];
    }

    return [
      {
        title,
        url,
        source: sourceName,
        sourceType: sourceType,
        rawContent: content,
        publishedAt: new Date(),
      },
    ];
  } catch (error) {
    console.error(`Error fetching web content from ${url}:`, error);
    return [];
  }
}

export async function scrapeSource(
  source: {
    id: string;
    name: string;
    url: string;
    type: string;
    category: string;
  }
): Promise<ScrapedStory[]> {
  if (source.type === 'rss') {
    return fetchRSSFeed(source.url, source.name, source.category);
  } else if (source.type === 'web') {
    return fetchWebContent(source.url, source.name, source.category);
  }

  return [];
}

export async function scrapeAllSources(
  sources: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    category: string;
  }>
): Promise<ScrapedStory[]> {
  const allStories: ScrapedStory[] = [];

  for (const source of sources) {
    const stories = await scrapeSource(source);
    allStories.push(...stories);

    // Add delay between requests to be respectful
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return allStories;
}
