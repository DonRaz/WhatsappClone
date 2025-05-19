// // FILE app/hooks/useAiDetectionOnImage.ts
import { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Resizer from "react-image-file-resizer";

interface MoodResult {
  moods: {
    [key: string]: number;
  };
}

interface ImageLog {
  originalSize: number;
  resizedSize: number;
  originalResolution: string;
  resizedResolution: string;
}

interface UseImagePromptResult {
  sendImagePrompt: (image: File | string, prompt?: string, resolution?: number) => Promise<MoodResult | null>;
  loading: boolean;
  error: string | null;
  imageLog: ImageLog | null;
}

export const useImagePrompt = (): UseImagePromptResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLog, setImageLog] = useState<ImageLog | null>(null);
  const lastCallTime = useRef<number>(0);



  const resizeImage = (file: File, maxSize: number): Promise<string> => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        maxSize,
        maxSize,
        'JPEG',
        50,
        0,
        (uri) => {
          resolve(uri as string);
        },
        'base64'
      );
    });
  };

  const getImageSize = (dataUrl: string): number => {
    const base64 = dataUrl.split(',')[1];
    return Math.ceil((base64.length * 3) / 4);
  };

  const getImageResolution = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(`${img.width}x${img.height}`);
      img.src = dataUrl;
    });
  };

  const sendImagePrompt = useCallback(async (image: File | string, prompt?: string, resolution = 64): Promise<MoodResult | null> => {
    const now = Date.now();
    if (now - lastCallTime.current < 10000) {
      setError('Rate limit exceeded. Please wait before sending another request.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      let originalImage: string;
      let resizedImage: string;

      if (typeof image === 'string') {
        originalImage = image;
        // If the image is already a string (base64), we need to convert it to a File object for resizing
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "image3.jpg", { type: "image/jpeg" });

        resizedImage = await resizeImage(file, resolution); // TESTING NOT RESIZEING 
      } else { // img is File format
        // throw new Error('File is in File format. shouldnt be!'); // TESTING NOT RESIZEING 
        originalImage = await fileToBase64(image);
        resizedImage = await resizeImage(image, resolution);
      }

      const originalSize = getImageSize(originalImage);
      const resizedSize = getImageSize(resizedImage);
      const originalResolution = await getImageResolution(originalImage);
      const resizedResolution = await getImageResolution(resizedImage);



      console.log("_________________________________ ORIGINAL ________________________ START : ")
      console.log(`Image data  ${originalImage}`);
        
        console.log("_________________________________ ORIGINAL ________________________ END : ")
        
        console.log("_________________________________ RESIZED ________________________ START : ")
      console.log(`Image data  ${resizedImage}`);
  
        console.log("_________________________________ RESIZEDL ________________________ END : ")
        
        console.trace();

      const log: ImageLog = {
        originalSize,
        resizedSize,
        originalResolution,
        resizedResolution
      };

      setImageLog(log);
      console.log('Image Log:', {
        originalSize: `${(originalSize / 1000).toFixed(2)} KB`,
        resizedSize: `${(resizedSize / 1000).toFixed(2)} KB`,
        originalResolution,
        resizedResolution
      });



      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: resizedImage } }
            ]
          }
        ]
      };

      // const response = await axios.post('/api/openai/imageDetection', payload);
      const response = await axios.post('/portfolio-sraz/mood-detector/server', payload);

      if (!response.data.success) {
        setError(response.data.error || 'Failed to process image response');
        return null;
      }
      lastCallTime.current = now;
      return response.data.message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      // Don't throw the error, just return null
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendImagePrompt, loading, error, imageLog };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

