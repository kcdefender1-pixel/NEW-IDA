import { NextRequest, NextResponse } from 'next/server';
import { performScan, getScanStatus } from '@/lib/analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const focus = body.focus || 'all';

    // Validate focus parameter
    if (!['all', 'police', 'organizing', 'troost', 'economy'].includes(focus)) {
      return NextResponse.json(
        { error: 'Invalid focus parameter' },
        { status: 400 }
      );
    }

    // Perform scan in background
    // For now, we'll do it synchronously. In production, use a job queue
    const result = await performScan(focus);

    return NextResponse.json({
      scanId: result.scanId,
      status: 'complete',
      storyCount: result.stories.length,
      briefText: result.briefText,
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to perform scan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const scanId = request.nextUrl.searchParams.get('id');

    if (!scanId) {
      return NextResponse.json(
        { error: 'Scan ID required' },
        { status: 400 }
      );
    }

    const status = await getScanStatus(scanId);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Get scan status error:', error);
    return NextResponse.json(
      { error: 'Failed to get scan status' },
      { status: 500 }
    );
  }
}
