"use server";

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

class SafeError extends Error {
  constructor(message: string, public code: string = "UNKNOWN_ERROR") {
    super(message);
    this.name = "SafeError";
  }
}

if (!GEMINI_API_KEY) {
  throw new SafeError("API configuration error", "CONFIG_ERROR");
}

const MAX_REQUESTS_PER_MINUTE = 5;

const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): { allowed: boolean; error?: SafeError } {
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return { allowed: true };
  }
  
  const timestamps = rateLimitMap.get(ip)!;
  const windowStart = now - windowMs;
  
  const recentTimestamps = timestamps.filter(time => time > windowStart);
  
  rateLimitMap.set(ip, [...recentTimestamps, now]);
  
  if (recentTimestamps.length < MAX_REQUESTS_PER_MINUTE) {
    return { allowed: true };
  } else {
    return { 
      allowed: false, 
      error: new SafeError("Rate limit exceeded. Please try again later.", "RATE_LIMIT_EXCEEDED") 
    };
  }
}

export async function streamRefactorCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed && rateCheck.error) {
    // Return a ReadableStream that immediately errors with a user-friendly message
    return new ReadableStream({
      start(controller) {
        controller.error(rateCheck.error instanceof Error ? rateCheck.error : new Error("Rate limit exceeded"));
      }
    });
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemPrompt = `
    You are a senior software engineer.
    You are given a code snippet and a prompt.
    You need to refactor the code to fix the issues and improve the code.
    `;

    const userInstructions = userPrompt ? `
    Additional instructions: ${userPrompt}
    ` : "";

    const codePrompt = `
    Code: ${prompt}
    ${userInstructions}
    `;

    const finalPrompt = [systemPrompt, codePrompt].join("\n");

    const streamingResponse = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: finalPrompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamingResponse) {
            if (chunk.text) {
              controller.enqueue(chunk.text);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return stream;
  } catch (error) {
    const safeError = new SafeError(
      "Failed to process your request. Please try again later.",
      "PROCESSING_ERROR"
    );
    return new ReadableStream({
      start(controller) {
        controller.error(safeError);
      }
    });
  }
}

export async function refactorCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed && rateCheck.error) {
    return { error: rateCheck.error.message, code: rateCheck.error.code };
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemPrompt = `
    You are a senior software engineer.
    You are given a code snippet and a prompt.
    You need to refactor the code to fix the issues and improve the code.
    `;

    const userInstructions = userPrompt ? `
    Additional instructions: ${userPrompt}
    ` : "";

    const codePrompt = `
    Code: ${prompt}
    ${userInstructions}
    `;

    const finalPrompt = [systemPrompt, codePrompt].join("\n");

    const streamingResponse = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: finalPrompt,
    });

    let fullText = "";
    for await (const chunk of streamingResponse) {
      if (chunk.text) {
        fullText += chunk.text;
      }
    }

    return { result: fullText };
  } catch (error) {
    const safeError = new SafeError(
      "Failed to process your request. Please try again later.",
      "PROCESSING_ERROR"
    );
    return { error: safeError.message, code: safeError.code };
  }
}

export async function streamExplainCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed && rateCheck.error) {
    // Return a ReadableStream that immediately errors with a user-friendly message
    return new ReadableStream({
      start(controller) {
        controller.error(rateCheck.error instanceof Error ? rateCheck.error : new Error("Rate limit exceeded"));
      }
    });
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemPrompt = `
    You are a senior software engineer.
    You are given a code snippet and a prompt.
    You need to explain the code to the user.
    `;

    const userInstructions = userPrompt ? `
    Additional instructions: ${userPrompt}
    ` : "";

    const codePrompt = `
    Code: ${prompt}
    ${userInstructions}
    `;

    const finalPrompt = [systemPrompt, codePrompt].join("\n");

    const streamingResponse = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: finalPrompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamingResponse) {
            if (chunk.text) {
              controller.enqueue(chunk.text);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return stream;
  } catch (error) {
    const safeError = new SafeError(
      "Failed to process your request. Please try again later.",
      "PROCESSING_ERROR"
    );
    return new ReadableStream({
      start(controller) {
        controller.error(safeError);
      }
    });
  }
}

export async function explainCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed && rateCheck.error) {
    return { error: rateCheck.error.message, code: rateCheck.error.code };
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemPrompt = `
    You are a senior software engineer.
    You are given a code snippet and a prompt.
    You need to explain the code to the user.
    `;

    const userInstructions = userPrompt ? `
    Additional instructions: ${userPrompt}
    ` : "";

    const codePrompt = `
    Code: ${prompt}
    ${userInstructions}
    `;

    const finalPrompt = [systemPrompt, codePrompt].join("\n");

    const streamingResponse = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: finalPrompt,
    });

    let fullText = "";
    for await (const chunk of streamingResponse) {
      if (chunk.text) {
        fullText += chunk.text;
      }
    }

    return { result: fullText };
  } catch (error) {
    const safeError = new SafeError(
      "Failed to process your request. Please try again later.",
      "PROCESSING_ERROR"
    );
    return { error: safeError.message, code: safeError.code };
  }
}

export async function streamGenerateCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed && rateCheck.error) {
    // Return a ReadableStream that immediately errors with a user-friendly message
    return new ReadableStream({
      start(controller) {
        controller.error(rateCheck.error instanceof Error ? rateCheck.error : new Error("Rate limit exceeded"));
      }
    });
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const systemPrompt = `
    You are a senior software engineer.
    You are given a code snippet and a prompt.
    You need to generate a code snippet that solves the problem.
    `;

    const userInstructions = userPrompt ? `
    Additional instructions: ${userPrompt}
    ` : "";

    const codePrompt = `
    Code: ${prompt}
    ${userInstructions}
    `;

    const finalPrompt = [systemPrompt, codePrompt].join("\n");

    const streamingResponse = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: finalPrompt,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamingResponse) {
            if (chunk.text) {
              controller.enqueue(chunk.text);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return stream;
  } catch (error) {
    const safeError = new SafeError(
      "Failed to process your request. Please try again later.",
      "PROCESSING_ERROR"
    );
    return new ReadableStream({
      start(controller) {
        controller.error(safeError);
      }
    });
  }
}
