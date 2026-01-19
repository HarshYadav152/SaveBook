
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SaveBookLinkPreview/1.0;)'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
    const image = $('meta[property="og:image"]').attr('content') || '';
    
    // Resolve relative URLs for images
    let imageUrl = image;
    if (image && !image.startsWith('http')) {
        try {
            imageUrl = new URL(image, url).toString();
        } catch (e) {
            imageUrl = '';
        }
    }

    return NextResponse.json({
      title,
      description,
      image: imageUrl,
      url
    });

  } catch (error) {
    console.error('Link preview error:', error);
    return NextResponse.json({ error: 'Failed to fetch link preview' }, { status: 500 });
  }
}
