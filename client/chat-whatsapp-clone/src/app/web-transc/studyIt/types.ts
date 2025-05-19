// src/types/worker.types.ts

export type WorkerStatus = 
  | 'loading' 
  | 'initiate' 
  | 'progress' 
  | 'done' 
  | 'ready' 
  | 'start' 
  | 'update' 
  | 'complete';

export interface WorkerMessage {
  status: WorkerStatus;
  data?: any;
  file?: string;
  progress?: number;
  total?: number;
  output?: string;
  tps?: number;
}

export interface GenerateParams {
  audio: Float32Array;
  language: string;
}

export type WorkerMessageType = 'load' | 'generate';

export interface WorkerRequest {
  type: WorkerMessageType;
  data?: GenerateParams;
}

// src/types/audio.types.ts

export interface AudioState {
  recording: boolean;
  isProcessing: boolean;
  chunks: Blob[];
  stream: MediaStream | null;
}

export interface AudioConfig {
  sampleRate: number;
  maxAudioLength: number;
  maxSamples: number;
}

// src/types/model.types.ts

export interface ProgressItem {
  file: string;
  progress: number;
  total: number;
}

export interface WorkerProgressMessage extends WorkerMessage {
  file: string;
  progress: number;
  total: number;
}

export interface ModelState {
  status: WorkerStatus | null;
  loadingMessage: string;
  progressItems: ProgressItem[];
  text: string;
  tps: number | null;
  language: string;
}

export interface ASRPipelineConfig {
  modelId: string;
  maxNewTokens: number;
  device: 'webgpu';
  dtype: {
    encoder_model: 'fp32' | 'fp16';
    decoder_model_merged: 'q4' | 'fp32';
  };
}
// export type WorkerStatus = 
//   | 'loading' 
//   | 'initiate' 
//   | 'progress' 
//   | 'done' 
//   | 'ready' 
//   | 'start' 
//   | 'update' 
//   | 'complete';

// export interface WorkerMessage {
//   status: WorkerStatus;
//   data?: any;
//   file?: string;
//   progress?: number;
//   total?: number;
//   output?: string;
//   tps?: number;
// }

// export interface GenerateParams {
//   audio: Float32Array;
//   language: string;
// }

// export type WorkerMessageType = 'load' | 'generate';

// export interface WorkerRequest {
//   type: WorkerMessageType;
//   data?: GenerateParams;
// }

// // src/types/audio.types.ts

// export interface AudioState {
//   recording: boolean;
//   isProcessing: boolean;
//   chunks: Blob[];
//   stream: MediaStream | null;
// }

// export interface AudioConfig {
//   sampleRate: number;
//   maxAudioLength: number;
//   maxSamples: number;
// }

// // src/types/model.types.ts

// export interface ProgressItem {
//   file: string;
//   progress: number;
//   total: number;
// }

// export interface WorkerProgressMessage extends WorkerMessage {
//   file: string;
//   progress: number;
//   total: number;
// }

// export interface ModelState {
//   status: WorkerStatus | null;
//   loadingMessage: string;
//   progressItems: ProgressItem[];
//   text: string;
//   tps: number | null;
//   language: string;
// }

// export interface ASRPipelineConfig {
//   modelId: string;
//   maxNewTokens: number;
//   device: 'webgpu';
//   dtype: {
//     encoder_model: 'fp32' | 'fp16';
//     decoder_model_merged: 'q4' | 'fp32';
//   };
// }
