// // FILE ___________ app / [locale] / baby-mood-detector / page.tsx

import { Suspense } from "react";
import ChatWithAIComponent from "./components/chatWithAI";


const ChatWithAI = async () => {


  return (


      <div className="flex items-center justify-center h-[calc(100svh-10rem)] mt-[10rem] bg-white1_dd w-[100swh]">
        {/* suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <ChatWithAIComponent/> 
        </Suspense>

      </div>

  );
  
};

export default ChatWithAI;