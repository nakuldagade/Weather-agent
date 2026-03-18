import OpenAI from "openai";

export async function POST(req: Request) {
  const body = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: body.messages,
  });

  return Response.json(response);
}
