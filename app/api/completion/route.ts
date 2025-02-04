import { CohereClient } from "cohere-ai";
import { NextResponse } from "next/server";

if (!process.env.COHERE_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_COHERE_API_KEY environment variable");
}

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { context, documentTitle, documentContent } = await request.json();

    if (!context) {
      return NextResponse.json(
        { error: "Context is required" },
        { status: 400 }
      );
    }

    const prompt = `Document Title: ${documentTitle || "Untitled"}
  ${documentContent ? `Document Content: ${documentContent}\n` : ""}
  Context: ${context}

  Instructions: Continue the text naturally while preserving its style and coherence.
  Text to continue:
  ${context}`;

    const response = await cohere.generate({
      model: "command",
      prompt,
      maxTokens: 20,
      temperature: 0.3,
      k: 0,
      p: 0.75,
      frequencyPenalty: 0.1,
      stopSequences: [".", "?", "!"],
    });

    const completion = response.generations[0]?.text?.trim();

    if (!completion) {
      console.error("Empty or invalid Cohere response:", response);
      return NextResponse.json(
        { error: "Empty or invalid response from Cohere" },
        { status: 500 }
      );
    }

    // Clean up the completion text
    const cleanedCompletion = completion
      .replace(/^["'\s]+|["'\s]+$/g, "") // Remove quotes and extra spaces
      .replace(/^[.,!?]\s*/, ""); // Remove leading punctuation

    if (!cleanedCompletion) {
      console.error("Empty completion after cleaning:", {
        original: completion,
        cleaned: cleanedCompletion,
      });
      return NextResponse.json(
        { error: "Empty completion after cleaning" },
        { status: 500 }
      );
    }

    return NextResponse.json({ completion: cleanedCompletion });
  } catch (error) {
    console.error("Cohere API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate completion" },
      { status: 500 }
    );
  }
}
