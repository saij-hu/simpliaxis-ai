export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const question = String(body.question || "").trim();
    const dashboardContext = body.context || {};

    if (!question) {
      return Response.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are the SIMPLIAXIS Live Dashboard AI Assistant.

Answer the user's question using ONLY the dashboard context provided below.

Rules:
- Never invent numbers.
- Never guess missing information.
- Respect current dashboard filters.
- Respect the user's permissions.
- Keep answers concise and professional.
- If the supplied data is insufficient, clearly say that the data is unavailable.
- Do not reveal passwords, OTPs, API keys, or secrets.

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
          "Authorization":
            `Bearer ${context.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5",
          input: prompt
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "OpenAI request failed:",
        errorText
      );

      return Response.json(
        {
          error:
            "AI service is temporarily unavailable."
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
    console.error(
      "AI function error:",
      error
    );

    return Response.json(
      {
        error:
          "Unable to process the AI request."
      },
      { status: 500 }
    );
  }
}
