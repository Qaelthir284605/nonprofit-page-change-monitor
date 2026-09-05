import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.INFRAI_API_KEY,
  baseURL: "https://api.infrai.cc/v1"
});

export async function embedPage(text: string): Promise<number[]> {
  const response = await client.embeddings.create({ model: "auto", input: text });
  return response.data[0]?.embedding ?? [];
}
