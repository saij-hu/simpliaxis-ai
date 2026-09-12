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
          input: `You are the SIMPLIAXIS Dashboard AI Assistant.

Answer this question using only the supplied dashboard context.

Dashboard Context:
${JSON.stringify(dashboardContext)}

Question:
${question}`
        })
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "OPENAI STATUS:",
        response.status
      );

      console.error(
        "OPENAI RESPONSE:",
        responseText
      );

      return Response.json(
        {
          error: "OpenAI request failed.",
          status: response.status,
          details: responseText
        },
        { status: 502 }
      );
    }

    const data =
      JSON.parse(responseText);

    return Response.json({
      success: true,
      answer:
        data.output_text ||
        "No answer returned."
    });

  } catch (error) {
    console.error(
      "AI FUNCTION ERROR:",
      error
    );

    return Response.json(
      {
        error: error.message
      },
      { status: 500 }
    );
  }
}
