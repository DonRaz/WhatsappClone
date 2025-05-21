// // FILE ___________ app / [locale] / baby-mood-detector / page.tsx

import { Suspense } from "react";
import { ClientWrapper } from "./(AI-Mood-Detection)/components/client-wrapper";

const MoodDetectorPage = () => {
  return (
    <div className="flex items-center flex-col justify-center bg-white1_dd w-full">
      {/* Header explaining the app (Beautiful with cool animation) */}
      <div className="bg-accent/50 text-foreground p-4 shadow-md flex items-center">
        <h1 className="text-xl font-bold">Baby Mood Detector</h1>
      </div>
      <p className="text-sm text-muted-foreground"> Using AI To take a picture of the baby's face and detect his mood, And control it by selecting the media playing </p>
      <p className="text-sm text-muted-foreground"> step 1: Detecting a baby's face based on on-device Vision AI model (Using TF.js)</p>
      <p className="text-sm text-muted-foreground"> step 2: Detecting the baby's mood based on the face's picture (using OpenAI API)</p>
      <p className="text-sm text-muted-foreground"> step 3: Playing a song based on the baby's mood</p>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientWrapper />
      </Suspense>
    </div>
  );
};

export default MoodDetectorPage;