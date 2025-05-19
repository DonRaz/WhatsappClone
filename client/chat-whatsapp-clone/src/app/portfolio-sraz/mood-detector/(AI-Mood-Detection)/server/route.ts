// FILE _________________ app/api/openai/imageDetection/route.ts _________ 
import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema definitions for validation
const imageContentSchema = z.object({
  type: z.enum(["image_url", "text"]),
  image_url: z.object({
    url: z.string()
  }).optional(),
  text: z.string().optional()
});

const messageSchema = z.object({
  role: z.enum(["user"]),
  content: z.array(imageContentSchema)
});

const imageDetectionRequestSchema = z.object({
  messages: z.array(messageSchema),
  mockResult: z.object({
    moods: z.record(z.number())
  }).optional()
});

// For mock purposes - generate random moods
function generateRandomMoods() {
  return {
    "😊 Happy": Math.random() * 0.8,
    "😢 Sad": Math.random() * 0.4,
    "😴 Sleepy": Math.random() * 0.5,
    "😠 Angry": Math.random() * 0.3,
    "😐 Neutral": Math.random() * 0.7
  };
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions" as const;

// const systemPrompt = `You are an emotion analyzer for babies. You evaluate the mood of a baby based on their facial expression, eye behavior, mouth movement, and any relevant microexpressions. Your goal is to determine the baby's current state of calmness or distress, and quantify it across several mood categories. Based on an image provided, output the estimated mood of the baby as a series of probabilities for different emotions. Use the following format: { mood: { happy: 0.5, angry: 0.1, sleepy: 0.8, calm: 0.7, distressed: 0.2, engaged: 0.4, unsettled: 0.1 } }. Only include emotions that are relevant to the baby's state, and always focus on determining whether the baby is calm or not. If the image is not clear or no baby is detected, respond with a detailed description of what is in the picture`; // 'No baby identified.'
// const systemPrompt = `You are an emotion analyzer. respond with a detailed description of what is in the picture`; // 'No baby identified.'
// const systemPrompt = `You are an emotion analyzer for huimans. You evaluate the mood of a huiman based on their facial expression, eye behavior, mouth movement, and any relevant microexpressions. Your goal is to determine the huimans's current state of calmness or distress, and quantify it across several mood categories. Based on an image provided, output the estimated mood of the huimans as a series of probabilities for different emotions. Use the following format: { mood: { happy: 0.5, angry: 0.1, sleepy: 0.8, calm: 0.7, distressed: 0.2, engaged: 0.4, unsettled: 0.1 } }. Only include emotions that are relevant to the baby's state, and always focus on determining whether the baby is calm or not. In any case you'll respond with the JSON format`; // 'No baby identified.'

  // Updated system prompt to request JSON output
  const systemPrompt = `You are an emotion analyzer. Analyze the image and return ONLY a JSON object in the following format, with no additional text:
  {
    "moods": {
      "happy": <number between 0 and 1>,
      "sad": <number between 0 and 1>,
      "angry": <number between 0 and 1>,
      "neutral": <number between 0 and 1>,
      "sleepy": <number between 0 and 1>
    }
  }`;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log('imageDetection route - requestBody =', requestBody);
    const generateMockResponse = false;
    const parsedRequest = imageDetectionRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      console.log("Invalid schema", parsedRequest.error);
      return NextResponse.json({ error: "Invalid schema", success: false }, { status: 400 });
    }

    // Use mock result if provided (for testing)
    if (parsedRequest.data.mockResult) {
      console.log('Using provided mock result');
      return NextResponse.json({ 
        success: true, 
        message: parsedRequest.data.mockResult
      });
    }

    // Generate random mock response instead of calling OpenAI
    // This avoids Content Security Policy issues with base64 images
    if(generateMockResponse) {
      const mockResponse = {
        moods: generateRandomMoods()
      };

      return NextResponse.json({ 
        success: true, 
        message: mockResponse 
      });
    }

    
    // Original OpenAI API code - commented out to avoid CSP issues
    const { messages } = parsedRequest.data;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(message => ({
          role: message.role,
          content: message.content.map(c => ({
            type: c.type,
            image_url: c.image_url ? { url: c.image_url.url } : undefined,
            text: c.text
          }))
        }))
      ],
      max_tokens: 300,
      response_format: { type: "json_object" }
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    console.log("imageDetection route - payload =", JSON.stringify(payload, null, 2));

    const response = await axios.post(OPENAI_URL, payload, { headers });
    const assistantMessage = response.data.choices[0].message.content;

    console.log('assistantMessage = ', JSON.stringify(assistantMessage))

    // Parse the response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(assistantMessage);
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      return NextResponse.json({ error: "Failed to parse OpenAI response", success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: parsedResponse });
    
    
  } catch (error) {
    console.error("Error in imageDetection route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while processing the image" },
      { status: 500 }
    );
  }
}