# File Storage Abstraction - Implementation Plan

## 1. Overview
This document outlines the implementation plan for a file storage abstraction layer in our application. The goal is to create a flexible system that allows easy switching between different file storage providers (UploadThing, Cloudinary, AWS S3, Firebase, etc.) without requiring significant code changes across the application.

## 2. Current Implementation
Currently, the application uses UploadThing for image uploads, with direct dependencies on UploadThing's components and APIs in multiple places including:
- ProfileImageUpload component
- ConversationImageUpload component
- Server-side uploadthing configuration

## 3. Goals
- Create an abstraction layer that decouples the application from any specific storage provider
- Maintain a clean separation between storage logic and UI components
- Enable simple configuration-based switching between providers
- Ensure a consistent interface for file operations across different providers
- Support progress tracking for file uploads
- Minimize code changes required when adding new storage providers

## 4. Architecture
The solution follows the Adapter Pattern:

1. **Core Interface**: Define a `FileStorageService` interface for storage operations
2. **Provider Adapters**: Implement adapters for each storage provider
3. **Factory**: Use a factory to instantiate the appropriate adapter based on configuration
4. **UI Components**: Create UI components that use the abstraction but adapt rendering based on provider

## 5. Implementation Steps

### Step 1: Define Core Interfaces and Types [✅]
1. Create file at `src/lib/storage/types.ts` ✅
2. Define interfaces for `FileUploadResponse`, `FileUploadProgressEvent`, `FileUploadOptions` ✅
3. Define the `FileStorageService` interface with methods like `uploadFile`, `deleteFile`, etc. ✅

### Step 2: Implement UploadThing Adapter [✅]
1. Create file at `src/lib/storage/providers/uploadthingService.tsx` ✅
2. Implement `UploadThingStorageService` class that implements `FileStorageService` ✅
3. Handle direct programmatic uploads using UploadThing's SDK ✅
4. Implement progress tracking and error handling ✅

### Step 3: Create Storage Service Factory [✅]
1. Create file at `src/lib/storage/index.ts` ✅
2. Create `StorageProviderType` enum or type ✅
3. Implement `getStorageService` factory function ✅
4. Create configuration file at `src/config/storage.ts` ✅
5. Set up environment variables for different providers ✅

### Step 4: Build UI Abstraction Components [✅]
1. Create file at `src/components/upload/FileUploader.tsx` ✅
2. Create `FileUploader` component that renders appropriate UI based on provider ✅
3. Implement progress indicators and error handling ✅
4. Create generic UI components for use when provider-specific components aren't available ✅

### Step 5: Update Existing Components [✅]
1. Update `ProfileImageUpload` to use `FileUploader` or directly use the storage service ✅
2. Update `ConversationImageUpload` similarly ✅
3. Ensure the UI behavior and experience remains consistent ✅

### Step 6: Server-Side Integration [✅]
1. Evaluate if server-side abstracting is needed for UploadThing handlers ✅
2. If needed, create server-side adapters for handling uploads ✅
3. Update server-side configuration as needed ✅

### Step 7: Testing and Validation [✅]
1. Test all upload functionality with UploadThing ✅
2. Create a mock adapter for testing purposes ✅
3. Validate that switching providers via configuration works ✅

### Step 8: Documentation [✅]
1. Document the abstraction architecture ✅
2. Create examples of how to use the abstraction ✅
3. Document how to add new storage providers ✅

## 6. Progress Tracking
We'll mark each step with a ✅ as we complete it.
