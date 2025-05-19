import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";


// Define the schema for text content
const textContentSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});


// const translatedInstructions = t('gptInstructions4Jul24')
const translatedInstructions = `You are a friendly and professional DJ who helps users find songs they will like that fit the event. Your job is to gather guests' musical tastes so the music unites and energizes the party. Use concise, to-the-point answers (less than 40 words each). Be friendly, professional, and energized. Regularly ask guests for song or artist requests. Respond in the language used by the guest`
// Define the schema for image content
const imageContentSchema = z.object({
  type: z.literal("image_url"),
  image_url: z.object({
    url: z.string().url(),
  }),
});

// Create a union of text and image content schemas
const contentSchema = z.union([textContentSchema, imageContentSchema]);

// Define the schema for a message
const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.array(contentSchema),
});

// Define the schema for the chat request
const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
});

const OPENAI_URL = "https://api.openai.com/v1/chat/completions" as const;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json().catch(error => {
      console.error("Failed to parse request body", error);
      return null;
    });
    
    if (!requestBody) {
      return NextResponse.json({ 
        error: "Invalid request body", 
        success: false 
      }, { status: 400 });
    }
    
    console.log('openAI route - requestBody =', requestBody);
    const parsedRequest = chatRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      console.log("Invalid schema", parsedRequest.error);
      return NextResponse.json({ 
        error: "Invalid schema: " + parsedRequest.error.message, 
        success: false 
      }, { status: 400 });
    }

    // Clone the messages and keep image URLs intact
    const clonedMessages = parsedRequest.data.messages.map((message) => ({
      ...message,
      content: message.content.map((content) => {
        if (content.type === "image_url") {
          return {
            type: content.type,
            image_url: {
              url: content.image_url.url, // data URL (base64)
            },
          };
        }
        return content;
      }),
    }));

    // Add instruction message
    clonedMessages.unshift({
      role: "system",
      content: [
        {
          type: "text",
          text: translatedInstructions,
        }
      ]
    });

    // Format messages for OpenAI API
    // OpenAI API accepts either a string or an array of content objects
    const apiMessages = clonedMessages.map(message => {
      // If all content is text, join them
      const isAllText = message.content.every(c => c.type === "text");
      
      if (isAllText) {
        return {
          role: message.role,
          content: message.content.map(c => c.type === 'text' ? c.text : '').join('\n')
        };
      }
      
      // Otherwise, keep the array structure for mixed content
      return {
        role: message.role,
        content: message.content
      };
    });

    const payload = {
      model: "gpt-4o-mini", // gpt-4o
      messages: apiMessages,
      max_tokens: 500,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    console.log("Sending payload to OpenAI...");
    
    const response = await axios.post(OPENAI_URL, payload, { 
      headers,
      timeout: 30000 // 30 second timeout
    });
    
    const firstMessage = response.data.choices[0].message;
    console.log('Received response from OpenAI:', firstMessage);
    
    return NextResponse.json({ success: true, message: response.data });
  } catch (error: any) {
    console.error("API error:", error);
    
    // Handle different error types
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error?.message || error.message || "Unknown API error";
      
      return NextResponse.json(
        { 
          success: false, 
          message: null, 
          error: `API error (${statusCode}): ${errorMessage}` 
        },
        { status: statusCode }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: null, 
        error: error.message || "Unknown error occurred" 
      },
      { status: 500 }
    );
  }
}
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { z } from "zod";

// // Define the schema for text content
// const textContentSchema = z.object({
//   type: z.literal("text"),
//   text: z.string(),
// });

// // Define the schema for image content
// const imageContentSchema = z.object({
//   type: z.literal("image_url"),
//   image_url: z.object({
//     url: z.string().url(),
//   }),
// });

// // Create a union of text and image content schemas
// const contentSchema = z.union([textContentSchema, imageContentSchema]);

// // Define the schema for a message
// const messageSchema = z.object({
//   role: z.enum(["user", "assistant", "system"]),
//   content: z.array(contentSchema),
// });

// // Define the schema for the chat request
// const chatRequestSchema = z.object({
//   messages: z.array(messageSchema),
// });

// const OPENAI_URL = "https://api.openai.com/v1/chat/completions" as const;

// // Type guard to check if content is text content
// function isTextContent(content: z.infer<typeof contentSchema>): content is z.infer<typeof textContentSchema> {
//   return content.type === "text";
// }

// export async function POST(request: Request) {
//   const requestBody = await request.json();
//   console.log('openAI route - requestBody =', requestBody);
//   const parsedRequest = chatRequestSchema.safeParse(requestBody);

//   if (!parsedRequest.success) {
//     console.log("Invalid schema", parsedRequest.error);
//     return NextResponse.json({ error: "Invalid schema", success: false });
//   }

//   // Clone the messages and replace image URLs with a placeholder
//   const clonedMessages = parsedRequest.data.messages.map((message) => ({
//     ...message,
//     content: message.content.map((content) => {
//       if (content.type === "image_url") {
//         return {
//           type: content.type,
//           image_url: {
//             url: content.image_url.url,
//           },
//         };
//       }
//       return content;
//     }),
//   }));

//   // Add instruction message
//   clonedMessages.unshift({
//     role: "system",
//     content: [
//       {
//         type: "text",
//         text: "You are a DJ that helps the user find songs they will like that will fit the event."
//       }
//     ]
//   });

//   console.log("clonedMessages", JSON.stringify(clonedMessages));
  

//   const payload = {
//     model: "gpt-4o",
//     messages: clonedMessages,
//     max_tokens: 300,
//   };

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//   };

//   console.log("openAI route .ts  - playlistsOfEvents Stringified = __________________________")
//   console.log(JSON.stringify({ headers, payload }, null, 2)) // Use null, 2 for pretty-printing

//   try {
//     const response = await axios.post(OPENAI_URL, payload, { headers });
//     const firstMessage = response.data.choices[0].message;
//     console.log('firstMessage = ', firstMessage); // WORKS FINALLY! 
//     return NextResponse.json({ success: true, message: response.data });
//   } catch (error) {
//     console.log("error", error);
//     return NextResponse.json(
//       { success: false, message: null },
//       { status: 500 }
//     );
//   }
// }


