// // FILE ___________ app / [locale] / baby-mood-detector / page.tsx

import { Suspense } from "react";
import { BabyMoodDetectorComponent } from "./(AI-Mood-Detection)/components/baby-mood-detector"


const MoodDetectorPage = async () => {


  return (


      <div className="flex items-center justify-center h-[calc(100svh-10rem)] mt-[10rem] bg-white1_dd w-[100swh]">
        {/* suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <BabyMoodDetectorComponent/> 
        </Suspense>

      </div>

  );
  
};

export default MoodDetectorPage;