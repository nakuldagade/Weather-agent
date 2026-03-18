import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.messages) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: body.messages,
    });

    const reply =
      completion.choices?.[0]?.message?.content || "No response";

    return Response.json({ reply });

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
