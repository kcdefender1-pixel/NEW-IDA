import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPTS, getTimeBasedGreeting } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface StoryAnalysis {
  summary: string;
  strategicValue:
    | 'narrative_leadership'
    | 'power_building'
    | 'agitation'
    | 'audience_growth'
    | 'morale';
  relevanceScore: number;
  abolitionistAngle: string;
  framingAdvice: string;
  competitiveEdge: string;
  timeUrgency: 'immediate' | 'today' | 'this_week' | 'evergreen';
  suggestedWriter: string;
  tags: string[];
  patternNote: string;
}

export async function analyzeStory(
  storyContent: string
): Promise<StoryAnalysis> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: SYSTEM_PROMPTS.storyAnalysis,
    messages: [
      {
        role: 'user',
        content: `Please analyze this story:\n\n${storyContent}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    const analysis = JSON.parse(responseText);
    return analysis as StoryAnalysis;
  } catch (error) {
    console.error('Failed to parse Claude response as JSON:', responseText);
    throw new Error('Failed to analyze story: invalid JSON response');
  }
}

export interface BriefGenerationInput {
  stories: Array<{
    title: string;
    source: string;
    summary: string;
    strategicValue: string;
    relevanceScore: number;
    framingAdvice: string;
    suggestedWriter: string;
  }>;
}

export async function generateBrief(
  input: BriefGenerationInput
): Promise<string> {
  const storiesContext = input.stories
    .map(
      (story, i) => `
Story ${i + 1}: "${story.title}"
Source: ${story.source}
Summary: ${story.summary}
Strategic Value: ${story.strategicValue}
Relevance Score: ${story.relevanceScore}/100
Framing Advice: ${story.framingAdvice}
Suggested Writer: ${story.suggestedWriter}
`
    )
    .join('\n---\n');

  const userPrompt = `Here are today's analyzed stories. Generate a conversational editorial brief for The Kansas City Defender newsroom. Start with a time-aware greeting. Remember to follow all formatting rules: no em dashes, no bullet points, flowing prose throughout.

${storiesContext}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    system: SYSTEM_PROMPTS.briefGeneration,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export interface ChatMessage {
  role: 'user' | 'ida';
  content: string;
}

export async function chatWithIDA(
  userMessage: string,
  conversationHistory: ChatMessage[],
  storyContext?: string
): Promise<string> {
  const systemPrompt =
    SYSTEM_PROMPTS.chat +
    (storyContext
      ? `\n\nCURRENT STORY CONTEXT:\n${storyContext}`
      : '');

  const messages = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: userMessage,
    },
  ];

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function generateGreeting(): Promise<string> {
  return getTimeBasedGreeting();
}
