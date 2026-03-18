import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    // ✅ DEBUG LOG
    console.log("ENV KEY:", process.env.OPENAI_API_KEY);

    // ❗ SAFE PARSE
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    if (!body?.messages) {
      return Response.json(
        { error: "Messages missing in request" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: body.messages,
    });

    return Response.json(response);

  } catch (err) {
    console.error("FINAL ERROR:", err);
    return Response.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
