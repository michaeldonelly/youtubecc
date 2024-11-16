import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSubtitles } from 'youtube-captions-scraper';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { videoId } = request.query;

    if (!videoId || typeof videoId !== 'string') {
      return response.status(400).json({ error: 'Video ID is required' });
    }

    const captions = await getSubtitles({
      videoID: videoId,
      lang: 'en'
    });

    return response.status(200).json(captions);
  } catch (error) {
    console.error('Error fetching captions:', error);
    return response.status(500).json({ error: 'Failed to fetch captions' });
  }
}