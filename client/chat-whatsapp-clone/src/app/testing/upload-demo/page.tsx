"use client";

import { useState } from "react";
import UploadFile from "@/components/upload/UploadFile";

type UploadedFile = {
  url: string;
  name: string;
  size: number;
};

export default function UploadDemoPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedFile[]>([]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">UploadThing Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <UploadFile 
            endpoint="imageUploader"
            onUploadComplete={(files) => {
              setUploadedImages((prev) => [...prev, ...files]);
            }}
            className="w-full"
          />
          
          {uploadedImages.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 gap-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border">
                    <img 
                      src={file.url} 
                      alt={file.name} 
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
          <UploadFile 
            endpoint="documentUploader"
            onUploadComplete={(files) => {
              setUploadedDocs((prev) => [...prev, ...files]);
            }}
            className="w-full"
          />
          
          {uploadedDocs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
              <ul className="space-y-2">
                {uploadedDocs.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2 p-2 border rounded">
                    <div className="p-2 bg-gray-100 rounded">
                      <span className="text-gray-700">
                        {file.name.endsWith('.pdf') ? 'PDF' : 'DOC'}
                      </span>
                    </div>
                    <div>
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-medium"
                      >
                        {file.name}
                      </a>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 