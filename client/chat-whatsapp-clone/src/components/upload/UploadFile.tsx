"use client";

import { useState } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

type UploadedFile = {
  url: string;
  name: string;
  size: number;
};

interface UploadFileProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  endpoint: "imageUploader" | "documentUploader";
  className?: string;
  dropzoneClassName?: string;
}

export default function UploadFile({
  onUploadComplete,
  endpoint = "imageUploader",
  className = "",
  dropzoneClassName = "",
}: UploadFileProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Dropzone for drag and drop */}
        <UploadDropzone
          endpoint={endpoint}
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            const uploadedFiles = res.map((file) => ({
              url: file.url,
              name: file.name,
              size: file.size,
            }));
            
            setFiles((prev) => [...prev, ...uploadedFiles]);
            setIsUploading(false);
            
            if (onUploadComplete) {
              onUploadComplete(uploadedFiles);
            }
          }}
          onUploadError={(error: Error) => {
            setIsUploading(false);
            console.error("Error uploading:", error.message);
            // You might want to display this error to the user
          }}
          className={dropzoneClassName}
        />

        {/* Button for file picker dialog */}
        <div className="mt-4">
          <UploadButton
            endpoint={endpoint}
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              const uploadedFiles = res.map((file) => ({
                url: file.url,
                name: file.name,
                size: file.size,
              }));
              
              setFiles((prev) => [...prev, ...uploadedFiles]);
              setIsUploading(false);
              
              if (onUploadComplete) {
                onUploadComplete(uploadedFiles);
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              console.error("Error uploading:", error.message);
            }}
          />
        </div>

        {/* Display uploaded files */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Uploaded Files</h3>
            <ul className="mt-2 space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {file.name}
                  </a>
                  <span className="text-sm text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 