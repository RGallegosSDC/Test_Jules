import { NextResponse } from 'next/server';

// This is a mock API route for local testing without a Vercel Blob token.
// It simulates a successful upload by returning a placeholder image URL.
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ message: 'No filename provided.' }, { status: 400 });
  }

  // Simulate a successful upload by returning a placeholder image URL
  const mockBlob = {
    url: `https://placehold.co/600x400?text=Uploaded:${filename}`,
    pathname: filename,
    contentType: 'image/jpeg',
    contentDisposition: `attachment; filename="${filename}"`,
  };

  return NextResponse.json(mockBlob);
}