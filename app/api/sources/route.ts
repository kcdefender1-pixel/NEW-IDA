import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error('Get sources error:', error);
    return NextResponse.json(
      { error: 'Failed to get sources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, type, category } = body;

    if (!name || !url || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const source = await prisma.source.create({
      data: {
        name,
        url,
        type,
        category,
        active: true,
      },
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    console.error('Create source error:', error);
    return NextResponse.json(
      { error: 'Failed to create source' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Source ID required' },
        { status: 400 }
      );
    }

    const source = await prisma.source.update({
      where: { id },
      data: {
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ source });
  } catch (error) {
    console.error('Update source error:', error);
    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Source ID required' },
        { status: 400 }
      );
    }

    await prisma.source.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete source error:', error);
    return NextResponse.json(
      { error: 'Failed to delete source' },
      { status: 500 }
    );
  }
}
