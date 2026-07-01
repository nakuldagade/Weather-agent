const MASTRA_API_URL =
  "https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream";
const THREAD_ID = "60002220086";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.messages) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const response = await fetch(MASTRA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: body.messages,
        runId: "weatherAgent",
        maxRetries: 2,
        maxSteps: 5,
        temperature: 0.5,
        topP: 1,
        runtimeContext: {},
        threadId: THREAD_ID,
        resourceId: "weatherAgent",
      }),
    });

    if (!response.ok) {
      console.error("Mastra API error:", response.status, response.statusText);
      return Response.json(
        { error: `Weather agent error (${response.status})` },
        { status: 502 }
      );
    }

    // Collect the streamed response text
    const rawText = await response.text();
    let reply = "";

    for (const line of rawText.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Vercel AI SDK streaming format: 0:"chunk of text"
      const streamMatch = trimmed.match(/^\d+:"(.*)"/);
      if (streamMatch) {
        // Unescape common escape sequences
        reply += streamMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
        continue;
      }

      // SSE format: data: {"type":"text","content":"..."}
      if (trimmed.startsWith("data: ")) {
        try {
          const data = JSON.parse(trimmed.slice(6));
          if (data.type === "text" && data.content) {
            reply += data.content;
          }
        } catch {
          // skip non-JSON data lines
        }
      }
    }

    return Response.json({ reply: reply || "No response from weather agent." });
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
