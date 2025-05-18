// // FILE ___________ app / [locale] / baby-mood-detector / page.tsx

import { Suspense } from "react";
import ChatWithAIComponent from "./components/chatWithAI";


const ChatWithAI = async () => {


  return (


      <div className="flex items-center bg-background justify-center h-[calc(100svh-5rem)] my-auto rounded  max-w-[40rem] mx-auto">
        {/* suspense */}
        <Suspense fallback={<div>Loading...</div>}>
          <ChatWithAIComponent/> 
        </Suspense>

      </div>

  );
  
};

export default ChatWithAI;