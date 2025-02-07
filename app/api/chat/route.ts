import { CohereClientV2 } from 'cohere-ai';

const cohere = new CohereClientV2({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY,

});
export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages) {
    return new Response("Prompt is required", { status: 400 });
  }

  try {
    const message = await cohere.chat({
      model: 'command-r-plus',
      messages: messages.map((m: {role: string; content: string}) => ({
        role: m.role,
        content: m.content
      })),
    });
 
    return new Response(
      JSON.stringify({ content: message.message?.content?.[0].text ?? 'No response content' }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return new Response("Error fetching AI response", { status: 500 });
  }
}
