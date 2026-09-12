export async function onRequestPost(context) {
  try {
    const request = context.request;
    const env = context.env;

    const body = await request.json();

    const question = String(body.question || "").trim();
    const dashboardContext = body.context || {};

    if (!question) {
      return Response.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are the SIMPLIAXIS Dashboard AI Assistant.

Answer ONLY from the dashboard context provided below.

Rules:
- Never invent numbers.
- Never guess missing information.
- Respect the current dashboard filters.
- Respect user permissions.
- Keep the answer concise and professional.
- If the information is unavailable, say so clearly.

Dashboard Context:
${JSON.stringify(dashboardContext)}

User Question:
${question}
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5",
          input: prompt
        })
      }
    );

    if (!response.ok) {
      console.error("OpenAI request failed:", await response.text());

      return Response.json(
        {
          error: "AI service is temporarily unavailable."
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    return Response.json({
      answer:
        data.output_text ||
        "I could not generate an answer."
    });

  } catch (error) {
    console.error("AI function error:", error);

    return Response.json(
      {
        error: "Unable to process the AI request."
      },
      { status: 500 }
    );
  }
}
