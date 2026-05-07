interface OpenRouterJsonOptions {
  prompt: string;
  maxTokens?: number;
}

export async function callOpenRouterJson(options: OpenRouterJsonOptions): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const model = process.env.OPENROUTER_MODEL || "moonshotai/kimi-k2.6";
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "FARO Free Scan"
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      max_tokens: options.maxTokens ?? 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator for FARO. Use only the supplied text. Do not browse, infer private facts, or invent details."
        },
        { role: "user", content: options.prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return JSON.parse(content) as Record<string, unknown>;
}
