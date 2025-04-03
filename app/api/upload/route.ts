import { writeFile } from 'fs/promises';
import path from 'path';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to local storage (for development)
  const filePath = path.join(process.cwd(), 'public/audio', file.name);
  await writeFile(filePath, buffer);

  // The URL that will be stored in the database
  const audioUrl = `/audio/${file.name}`;

  return NextResponse.json({
    success: true,
    url: audioUrl,
  });
}
