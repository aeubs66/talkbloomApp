import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

import { completeStory } from '@/app/story/story-progress-service';

interface StoryProgressRequest {
  storyId: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = auth();
    
    // Check if user is authenticated
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.userId;
    const body: unknown = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    if (!('storyId' in body) || typeof body.storyId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid story ID' },
        { status: 400 }
      );
    }
    
    const { storyId } = body as StoryProgressRequest;
    
    if (!storyId || typeof storyId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid story ID' },
        { status: 400 }
      );
    }
    
    // Update server-side progress
    await completeStory(userId, storyId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating story progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}