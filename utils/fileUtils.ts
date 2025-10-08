
import type { FrameData } from '../types';

/**
 * Extracts the first frame of a video file and returns it as a Base64 encoded string.
 * @param videoFile The video file from which to extract the frame.
 * @returns A promise that resolves with the Base64 data and mime type of the first frame.
 */
export const extractFirstFrame = (videoFile: File): Promise<FrameData> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    const videoUrl = URL.createObjectURL(videoFile);
    video.src = videoUrl;

    video.onloadeddata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(videoUrl);
        return reject(new Error('Could not get 2D context from canvas.'));
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const mimeType = 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.9);
      
      URL.revokeObjectURL(videoUrl);
      video.remove();
      canvas.remove();

      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = dataUrl.split(',')[1];
      if (!base64) {
          return reject(new Error('Failed to extract base64 data from data URL.'));
      }
      resolve({ base64, mimeType });
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(videoUrl);
      video.remove();
      reject(new Error('Failed to load video file.'));
    };
  });
};
