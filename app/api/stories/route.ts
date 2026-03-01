import { NextRequest, NextResponse } from 'next/server';
import { getStoriesForScan } from '@/lib/analyzer';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const scanId = request.nextUrl.searchParams.get('scanId');
    const sort = request.nextUrl.searchParams.get('sort') || 'relevance';

    if (!scanId) {
      return NextResponse.json(
        { error: 'Scan ID required' },
        { status: 400 }
      );
    }

    const { stories, patterns } = await getStoriesForScan(scanId);

    // Apply sorting
    let sortedStories = [...stories];
    if (sort === 'time') {
      sortedStories.sort(
        (a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
      );
    } else {
      // Default: relevance (already sorted in getStoriesForScan)
    }

    return NextResponse.json({
      stories: sortedStories,
      patterns,
    });
  } catch (error) {
    console.error('Get stories error:', error);
    return NextResponse.json(
      { error: 'Failed to get stories' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyId, covered, skipped, notes } = body;

    if (!storyId) {
      return NextResponse.json(
        { error: 'Story ID required' },
        { status: 400 }
      );
    }

    const updated = await prisma.story.update({
      where: { id: storyId },
      data: {
        ...(covered !== undefined && { covered }),
        ...(skipped !== undefined && { skipped }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update story error:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}
