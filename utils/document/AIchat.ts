import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY || '',
});

interface AIMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface DocumentContext {
  title: string;
  content: string;
  selection: Record<string, unknown> | null;
}

export async function aiChatbot(
  messages: AIMessage[],
  context: DocumentContext
): Promise<string | null> {
  try {
    const prompt = `Document Context:
    ${context.title ? `Title: ${context.title}\n` : ''}${context.content ? `Content: ${context.content}\n` : ''}${context.selection ? `Selected: ${context.selection}\n` : ''}
    Chat History:
    ${messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}
    USER: ${messages[messages.length - 1].content}
    ASSISTANT:`;

    const response = await cohere.generate({
      model: 'command',
      prompt,
      maxTokens: 500,
      temperature: 0.7,
      k: 0,
      stopSequences: ["USER:", "\n\n"],
      returnLikelihoods: 'NONE',
    });

    return response.generations[0]?.text.trim() || null;
  } catch (error) {
    console.error("Error in AI chatbot:", error);
    return null;
  }
}

export async function getAutoCompletion(
  currentText: string,
  documentContext: DocumentContext
): Promise<string | null> {
  try {
    const response = await fetch('/api/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: currentText,
        documentTitle: documentContext.title,
        documentContent: documentContext.content
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Completion API error:', data.error);
      return null;
    }

    return data.completion;
  } catch (error) {
    console.error("Error in auto-completion:", error);
    return null;
  }
}
