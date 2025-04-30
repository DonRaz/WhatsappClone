import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

// Enable more verbose logging
console.log("Initializing UploadThing router");

export const uploadRouter = {
  // Image uploader - accepts only images
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      // This code runs on your server before upload
      // For authentication/authorization, you'd normally use the user ID
      // from the session/token
      console.log("Upload middleware running for imageUploader");
      
      try {
        // Log request information to help diagnose issues
        console.log("Upload request headers:", {
          origin: req.headers.origin,
          referer: req.headers.referer,
          host: req.headers.host,
        });
        
        // Add your authentication logic here
        // For now, we're allowing any upload
        return { userId: "user-id" }; // Replace with actual user authentication
      } catch (error) {
        console.error("Error in imageUploader middleware:", error);
        throw new Error("Unauthorized");
      }
    })
    .onUploadComplete((data) => {
      console.log("Upload completed with file data:", {
        name: data.file.name,
        size: data.file.size,
        key: data.file.key,
        url: data.file.url
      });
      
      // Return data to the client (this is what gets passed to onClientUploadComplete)
      return { 
        fileUrl: data.file.url,
        fileName: data.file.name,
        // Include any additional properties you want to send to the client
        url: data.file.url,  // Some clients might expect 'url' instead of 'fileUrl'
        name: data.file.name
      };
    }),
    
  // Document uploader - accepts text files and PDFs
  documentUploader: f({
    text: {
      maxFileSize: "16MB",
      maxFileCount: 3,
    },
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      console.log("Document upload middleware running");
      
      try {
        // Log request information
        console.log("Document upload request headers:", {
          origin: req.headers.origin,
          referer: req.headers.referer,
        });
        
        return { userId: "user-id" }; // Replace with actual user authentication
      } catch (error) {
        console.error("Error in documentUploader middleware:", error);
        throw new Error("Unauthorized");
      }
    })
    .onUploadComplete((data) => {
      console.log("Document upload completed with file data:", {
        name: data.file.name,
        size: data.file.size,
        key: data.file.key,
        url: data.file.url
      });
      
      // Return data to the client (this is what gets passed to onClientUploadComplete)
      return { 
        fileUrl: data.file.url,
        fileName: data.file.name,
        url: data.file.url,
        name: data.file.name
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter; 