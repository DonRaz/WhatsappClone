// // FILE ___________ app / [locale] / baby-mood-detector / page.tsx

import { Suspense } from "react";
import { BabyMoodDetectorComponent } from "./(AI-Mood-Detection)/components/baby-mood-detector"


const MoodDetectorPage = async () => {


  return (


      <div className="flex items-center flex-col justify-center  bg-white1_dd w-full">
        {/* Header explaning the app (Beautiful with cool animation) */}
        <div className="bg-accent/50 text-foreground p-4 shadow-md flex items-center">
          <h1 className="text-xl font-bold">Baby Mood Detector</h1>
        </div>
          <p className="text-sm text-muted-foreground"> Using AI To take a picture of the baby's face and detect his mood, to continue or the media playing to him</p>
          <p className="text-sm text-muted-foreground"> step 1: Detecting a baby's face based on local model of Tensorflow.JS</p>
          <p className="text-sm text-muted-foreground"> step 2: Detecting the baby's mood based on the face's picture (using OpenAI API)</p>
          <p className="text-sm text-muted-foreground"> step 3: Playing a song based on the baby's mood</p>

        {/* suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <BabyMoodDetectorComponent/> 
        </Suspense>

      </div>

  );
  
};

export default MoodDetectorPage;