export async function onRequestPost(context) {
  try {
    const hasKey =
      typeof context.env?.OPENAI_API_KEY === "string" &&
      context.env.OPENAI_API_KEY.trim().length > 0;

    return Response.json({
      function: "working",
      openaiKeyConfigured: hasKey
    });

  } catch (error) {
    console.error("AI function diagnostic error:", error);

    return Response.json(
      {
        function: "error",
        message: error.message
      },
      { status: 500 }
    );
  }
}

// redeployexport async function onRequestPost(context) {
  try {
    const hasKey =
      typeof context.env?.OPENAI_API_KEY === "string" &&
      context.env.OPENAI_API_KEY.trim().length > 0;

    return Response.json({
      function: "working",
      openaiKeyConfigured: hasKey
    });

  } catch (error) {
    console.error("AI function diagnostic error:", error);

    return Response.json(
      {
        function: "error",
        message: error.message
      },
      { status: 500 }
    );
  }
}

// redeploy
