/**
 * File Storage Service
 * 
 * This service provides a server-side abstraction for file storage operations.
 * It can be used to process, validate, and perform server-side operations on uploaded files.
 */

import { createUploadthing } from "uploadthing/express";
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

// Define the storage providers we support
export type StorageProvider = 'uploadthing' | 'local' | 's3';

// Service configuration
interface FileStorageConfig {
  provider: StorageProvider;
  baseUrl: string;
  localStoragePath?: string; // For local file storage
  s3Bucket?: string; // For S3 storage
  s3Region?: string;
}

// Get configuration from environment
const getStorageConfig = (): FileStorageConfig => {
  const provider = (process.env.STORAGE_PROVIDER || 'uploadthing') as StorageProvider;
  
  return {
    provider,
    baseUrl: process.env.STORAGE_BASE_URL || 'http://localhost:3010',
    localStoragePath: process.env.LOCAL_STORAGE_PATH || './uploads',
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION || 'us-east-1'
  };
};

// File validation service
export const validateFileUrl = async (url: string): Promise<boolean> => {
  try {
    // Basic URL validation
    const parsedUrl = new URL(url);
    
    // Check if it's our uploadthing URL
    if (parsedUrl.hostname.includes('utfs.io')) { // for uploadthing.com
      // For UploadThing, we trust their URLs
      return true;
    }
    
    // For other URLs, we might want to validate they're accessible
    // This would be a HEAD request to check the file exists and is accessible
    // But for now, we'll just do basic validation
    return true;
  } catch (error) {
    console.error('URL validation error:', error);
    return false;
  }
};

// Create a file management service
class FileStorageService {
  private config: FileStorageConfig;
  private uploadthing = createUploadthing();
  
  constructor(config?: Partial<FileStorageConfig>) {
    this.config = { ...getStorageConfig(), ...config };
    console.log(`Initialized FileStorageService with provider: ${this.config.provider}`);
  }
  
  /**
   * Generate a presigned URL for uploading a file directly to storage
   * This is useful for client-side uploads
   */
  async getPresignedUploadUrl(
    filename: string, 
    contentType: string, 
    maxSizeBytes: number
  ): Promise<{ url: string, fields?: Record<string, string> }> {
    // Implementation depends on the storage provider
    switch (this.config.provider) {
      case 'uploadthing':
        // UploadThing doesn't use presigned URLs in the same way
        // We would generate an uploadthing signature here
        throw new Error('Direct presigned URLs not supported for UploadThing');
        
      case 'local':
        // For local storage, we'd return our own upload endpoint
        return {
          url: `${this.config.baseUrl}/api/upload`,
          fields: {
            key: `${Date.now()}-${filename}`,
            'content-type': contentType,
            'max-size': maxSizeBytes.toString()
          }
        };
        
      case 's3':
        // For S3, we'd generate a presigned POST URL
        // Implementation would use AWS SDK
        throw new Error('S3 presigned URLs not implemented yet');
        
      default:
        throw new Error(`Unsupported storage provider: ${this.config.provider}`);
    }
  }
  
  /**
   * Delete a file from storage
   */
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract the file path or key from the URL
      const parsedUrl = new URL(fileUrl);
      
      // Handle different providers
      switch (this.config.provider) {
        case 'uploadthing':
          // UploadThing deletion would require their API
          // This is not fully implemented yet
          console.log('UploadThing deletion requested for:', fileUrl);
          return true;
          
        case 'local':
          // For local storage, we'd delete from the file system
          if (parsedUrl.pathname) {
            const filePath = path.join(
              this.config.localStoragePath || './uploads',
              path.basename(parsedUrl.pathname)
            );
            
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              return true;
            }
            return false;
          }
          return false;
          
        case 's3':
          // S3 deletion would use AWS SDK
          throw new Error('S3 file deletion not implemented yet');
          
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
  
  /**
   * Process an uploaded file
   * This might include resizing images, generating thumbnails, virus scanning, etc.
   */
  async processUploadedFile(fileUrl: string, options?: {
    generateThumbnail?: boolean;
    maxWidth?: number;
    maxHeight?: number;
  }): Promise<{ success: boolean, url: string, thumbnailUrl?: string }> {
    // In a real implementation, this would process the file based on options
    // For now, we'll just return the URL as-is
    console.log('Processing uploaded file:', fileUrl, options);
    
    return {
      success: true,
      url: fileUrl
    };
  }
}

// Export a singleton instance
const fileStorageService = new FileStorageService();
export default fileStorageService; 