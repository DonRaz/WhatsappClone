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
  sendImagePrompt: (image: File | string, prompt?: string, resolution?: number) => Promise<MoodResult>;
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
        (uri: string | Blob | File | ProgressEvent<FileReader>) => {
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

  const sendImagePrompt = useCallback(async (image: File | string, prompt?: string, resolution = 64): Promise<MoodResult> => {
    const now = Date.now();
    if (now - lastCallTime.current < 10000) {
      throw new Error('Rate limit exceeded. Please wait before sending another request.');
    }

    setLoading(true);
    setError(null);

    try {
      let originalImage: string;
      let resizedImage: string;
      let imageBlob: Blob;

      if (typeof image === 'string') {
        originalImage = image;
        // If the image is already a string (base64), we need to convert it to a File object for resizing
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          imageBlob = blob;
          const file = new File([blob], "image3.jpg", { type: "image/jpeg" });
          resizedImage = await resizeImage(file, resolution);
        } catch (error) {
          console.error("Error fetching image blob:", error);
          throw new Error("Failed to process image: unable to fetch image data");
        }
      } else { // img is File format
        originalImage = await fileToBase64(image);
        resizedImage = await resizeImage(image, resolution);
        imageBlob = await image.arrayBuffer().then(buffer => new Blob([buffer], { type: image.type }));
      }

      const originalSize = getImageSize(originalImage);
      const resizedSize = getImageSize(resizedImage);
      const originalResolution = await getImageResolution(originalImage);
      const resizedResolution = await getImageResolution(resizedImage);

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

      // Convert the base64 data URL to a mock backend URL to avoid CSP issues
      // In a real app, you would upload this to your server first and get a URL back
      const mockImageUrl = "https://example.com/mock-image.jpg";

      const payload = {
        messages: [
          {
            role: 'user',
            content: [
              // Use a mock URL instead of data URL to avoid CSP issues
              { type: 'text', text: `Analyze the facial expression in the image and provide mood scores. The person appears to be ${prompt || 'showing some emotion'}` }
            ]
          }
        ],
        // Add a mock mood result for testing without hitting the OpenAI API
        mockResult: {
          moods: {
            "😊 Happy": Math.random() * 0.8,
            "😢 Sad": Math.random() * 0.4,
            "😴 Sleepy": Math.random() * 0.5,
            "😠 Angry": Math.random() * 0.3,
            "😐 Neutral": Math.random() * 0.7
          }
        }
      };

      // For testing without API calls
      // Return mockResult directly to bypass the API call
      lastCallTime.current = now;
      return payload.mockResult;

      /* Commented out API call to avoid Content Security Policy issues
      const response = await axios.post('/portfolio-sraz/(sections)/(AI-Mood-Detection)/server', payload);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to process image response');
      }
      lastCallTime.current = now;
      return response.data.message;
      */
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
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

// import { useState, useRef, useCallback } from 'react';
// import axios from 'axios';

// interface MoodResult {
//   moods: {
//     [key: string]: number;
//   };
// }

// interface ImageLog {
//   originalSize: number;
//   resizedSize: number;
//   originalResolution: string;
//   resizedResolution: string;
// }

// interface UseImagePromptResult {
//   sendImagePrompt: (image: File | string, prompt: string, resolution?: number) => Promise<MoodResult>;
//   loading: boolean;
//   error: string | null;
//   imageLog: ImageLog | null;
// }

// export const useImagePrompt = (): UseImagePromptResult => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [imageLog, setImageLog] = useState<ImageLog | null>(null);
//   const lastCallTime = useRef<number>(0);


//   const resizeImage = async (imageDataUrl: string, targetSize: number = 30): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         if (!ctx) {
//           reject(new Error('Could not get canvas context'));
//           return;
//         }
//         // the target size is simply the bigger.
//         let newWidth, newHeight;
//         if (img.width > img.height) {
//           newWidth = targetSize;
//           newHeight = Math.round((img.height / img.width) * targetSize);
//         } else {
//           newHeight = targetSize;
//           newWidth = Math.round((img.width / img.height) * targetSize);
//         }

//         canvas.width = newWidth;
//         canvas.height = newHeight;

//         ctx.drawImage(img, 0, 0, newWidth, newHeight);
//         resolve(canvas.toDataURL('image/jpeg', 0.8));
//       };
//       img.onerror = reject;
//       img.src = imageDataUrl;
//     });
//   };

//   const getImageSize = (dataUrl: string): number => {
//     const base64 = dataUrl.split(',')[1];
//     return Math.ceil((base64.length * 3) / 4);
//   };

//   const getImageResolution = (dataUrl: string): Promise<string> => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => resolve(`${img.width}x${img.height}`);
//       img.src = dataUrl;
//     });
//   };

//   const saveImageToFile = async (dataUrl: string, fileName: string): Promise<string> => {
//     const response = await fetch(dataUrl);
//     const blob = await response.blob();
//     const file = new File([blob], fileName, { type: 'image/jpeg' });
    
//     // In a real scenario, you'd save this file to a server or local storage
//     // For this example, we'll just return a mock file path
//     return `/tmp/${fileName}`;
//   };

//   const sendImagePrompt = useCallback(async (image: File | string, prompt: string, resolution = 64): Promise<MoodResult> => {
//     const now = Date.now();
//     if (now - lastCallTime.current < 10000) {
//       throw new Error('Rate limit exceeded. Please wait before sending another request.');
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       let base64Image: string;
      
//       if (typeof image === 'string') {
//         base64Image = image;
//       } else {
//         base64Image = await fileToBase64(image);
//       }

//       const originalSize = getImageSize(base64Image);
//       const originalResolution = await getImageResolution(base64Image);

//       const resizedImage = await resizeImage(base64Image, resolution);
//       const resizedSize = getImageSize(resizedImage);
//       const resizedResolution = await getImageResolution(resizedImage);

//       const log: ImageLog = {
//         originalSize,
//         resizedSize,
//         originalResolution,
//         resizedResolution
//       };

//       setImageLog(log);
//       console.log('Image Log:', {
//         originalSize: `${(originalSize / 1000).toFixed(2)} KB`,
//         resizedSize: `${(resizedSize / 1000).toFixed(2)} KB`,
//         originalResolution,
//         resizedResolution
//       });

//       const payload = {
//         messages: [
//           {
//             role: 'user',
//             content: [
//               { type: 'image_url', image_url: { url: resizedImage } }
//             ]
//           }
//         ]
//       };

//       const response = await axios.post('/api/openai/imageDetection', payload);

//       if (!response.data.success) {
//         throw new Error(response.data.error || 'Failed to process image prompt');
//       }
//       lastCallTime.current = now;
//       return response.data.message;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { sendImagePrompt, loading, error, imageLog };
// };


// const fileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// };

// const parseMoodResult = (result: string): MoodResult => {
//   try {
//     return JSON.parse(result);
//   } catch (error) {
//     console.error('Failed to parse mood result:', error);
//     return { moods: {} };
//   }
// };