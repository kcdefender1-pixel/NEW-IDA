import { NextRequest, NextResponse } from 'next/server';
import { chatWithIDA } from '@/lib/claude';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, scanId, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    // Build story context if scanId is provided
    let storyContext = '';
    if (scanId) {
      const stories = await prisma.story.findMany({
        where: { scanId },
        orderBy: { relevanceScore: 'desc' },
        take: 10,
      });

      storyContext = stories
        .map(
          (s) =>
            `Title: ${s.title}\nSource: ${s.source}\nSummary: ${s.summary}\nRelevance: ${s.relevanceScore}`
        )
        .join('\n\n');
    }

    // Convert history format if provided
    const conversationHistory = history || [];

    // Get IDA's response
    const response = await chatWithIDA(
      message,
      conversationHistory,
      storyContext
    );

    // Save chat messages to database
    await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: message,
        scanId: scanId || undefined,
      },
    });

    await prisma.chatMessage.create({
      data: {
        role: 'ida',
        content: response,
        scanId: scanId || undefined,
      },
    });

    return NextResponse.json({
      response,
      role: 'ida',
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const scanId = request.nextUrl.searchParams.get('scanId');

    let query: any = {};
    if (scanId) {
      query.scanId = scanId;
    }

    const messages = await prisma.chatMessage.findMany({
      where: query,
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat history' },
      { status: 500 }
    );
  }
}
