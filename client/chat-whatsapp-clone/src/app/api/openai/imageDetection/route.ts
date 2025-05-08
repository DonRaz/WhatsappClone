import axios from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";

const imageContentSchema = z.object({
  type: z.literal("image_url"),
  image_url: z.object({
    url: z.string().url(),
  }),
});

const messageSchema = z.object({
  role: z.enum(["user"]),
  content: z.array(imageContentSchema),
});

const imageDetectionRequestSchema = z.object({
  messages: z.array(messageSchema),
});

const OPENAI_URL = "https://api.openai.com/v1/chat/completions" as const;

// Updated system prompt to request JSON output
const systemPrompt = `You are an emotion analyzer. Analyze the image and return ONLY a JSON object in the following format, with no additional text:
{
  "moods": {
    "😊 Happy": <number between 0 and 1>,
    "😢 Sad": <number between 0 and 1>,
    "😠 Angry": <number between 0 and 1>,
    "😐 Neutral": <number between 0 and 1>,
    "😴 Sleepy": <number between 0 and 1>
  }
}`;

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log('imageDetection route - requestBody =', requestBody);
    const parsedRequest = imageDetectionRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
      console.log("Invalid schema", parsedRequest.error);
      return NextResponse.json({ error: "Invalid schema", success: false }, { status: 400 });
    }

    const { messages } = parsedRequest.data;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(message => ({
          role: message.role,
          content: message.content.map(c => ({
            type: c.type,
            image_url: { url: c.image_url.url }
          }))
        }))
      ],
      max_tokens: 300,
      response_format: { type: "json_object" }  // Request JSON response
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