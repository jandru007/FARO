interface OpenRouterJsonOptions {
  prompt: string;
  maxTokens?: number;
}

export async function callOpenRouterJson(options: OpenRouterJsonOptions): Promise<Record<string, unknown>> {
  const first = await requestOpenRouter(options, true);
  if (first.content) return parseJsonContent(first.content);

  const retry = await requestOpenRouter(options, false);
  if (retry.content) return parseJsonContent(retry.content);

  throw new Error(`OpenRouter returned an empty response${retry.finishReason ? ` (${retry.finishReason})` : ""}.`);
}

async function requestOpenRouter(
  options: OpenRouterJsonOptions,
  jsonMode: boolean
): Promise<{ content: string | null; finishReason?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const model = process.env.OPENROUTER_MODEL || "moonshotai/kimi-k2.6";
  const timeoutMs = Number(process.env.OPENROUTER_REQUEST_TIMEOUT_MS ?? 45_000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
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
        reasoning: { effort: "none", exclude: true },
        thinking: { type: "disabled" },
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        messages: [
          {
            role: "system",
            content: `You are a strict JSON generator for FARO. Use only the supplied text. Do not browse, infer private facts, invent details, or think step by step.${
              jsonMode ? "" : " Return only one valid JSON object and no markdown."
            }`
          },
          { role: "user", content: options.prompt }
        ]
      })
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("OpenRouter request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ finish_reason?: string; message?: { content?: string | Array<{ text?: string }> } }>;
  };
  const choice = payload.choices?.[0];
  const content = normalizeContent(choice?.message?.content);

  return choice?.finish_reason ? { content, finishReason: choice.finish_reason } : { content };
}

function normalizeContent(content: string | Array<{ text?: string }> | undefined): string | null {
  if (typeof content === "string") return content.trim() || null;
  if (Array.isArray(content)) {
    const text = content
      .map((part) => part.text ?? "")
      .join("")
      .trim();
    return text || null;
  }
  return null;
}

function parseJsonContent(content: string): Record<string, unknown> {
  try {
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error("OpenRouter returned non-JSON content.");
  }
}
