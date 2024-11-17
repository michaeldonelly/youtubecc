import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSubtitles } from 'youtube-captions-scraper';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { videoId } = request.query;

  if (!videoId || typeof videoId !== 'string') {
    return response.status(400).json({ 
      error: 'Video ID is required and must be a string' 
    });
  }

  try {
    const captions = await getSubtitles({
      videoID: videoId,
      lang: 'en'
    });

    if (!captions || captions.length === 0) {
      return response.status(404).json({ 
        error: 'No English captions found for this video' 
      });
    }

    response.setHeader('Cache-Control', 's-maxage=3600');
    return response.status(200).json(captions);
  } catch (error) {
    console.error('Error fetching captions:', error);
    
    // Check if it's a specific error from the captions scraper
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch captions';
    const statusCode = errorMessage.includes('Could not find video') ? 404 : 500;

    return response.status(statusCode).json({ 
      error: errorMessage 
    });
  }
}