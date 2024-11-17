import axios from 'axios';

export const extractVideoId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (!match) {
    throw new Error('Invalid YouTube URL');
  }
  return match[1];
};

export const downloadCaptions = async (url: string): Promise<void> => {
  const videoId = extractVideoId(url);
  const response = await axios.get(`/api/captions?videoId=${videoId}`);
  
  const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `captions-${videoId}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
};