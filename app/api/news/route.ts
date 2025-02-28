// Create a new file: app/api/news/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');
  
  if (!topic) {
    return NextResponse.json({ error: 'Topic parameter is required' }, { status: 400 });
  }
  
  try {
    const apiKey = process.env.NEWS_API_KEY; // No NEXT_PUBLIC_ prefix for server-side
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key is not configured' }, 
        { status: 500 }
      );
    }
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}&sortBy=publishedAt`
    );
    
    const data = await response.json();
    
    // Pass only the data to the client, not the API key
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}