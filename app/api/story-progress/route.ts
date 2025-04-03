import { NextRequest, NextResponse } from 'next/server';
import { completeStory } from '@/app/story/story-progress-service';
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { storyId } = await request.json();
    
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