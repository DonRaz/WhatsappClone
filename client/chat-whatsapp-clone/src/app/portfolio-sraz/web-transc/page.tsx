'use client';

import { WhisperTranscription } from './components/WhisperTranscription';

export default function TranscriptionPage() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col items-center justify-center p-4 gap-2">
      <WhisperTranscription />
    </div>
  );
}