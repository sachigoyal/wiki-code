"use server";

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set");
}

const MAX_REQUESTS_PER_MINUTE = 5;

const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [now]);
    return true;
  }
  
  const timestamps = rateLimitMap.get(ip)!;
  const windowStart = now - windowMs;
  
  const recentTimestamps = timestamps.filter(time => time > windowStart);
  
  rateLimitMap.set(ip, [...recentTimestamps, now]);
  
  return recentTimestamps.length < MAX_REQUESTS_PER_MINUTE;
}

export async function streamRefactorCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  if (!checkRateLimit(ip)) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
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
}

export async function refactorCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  if (!checkRateLimit(ip)) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
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

  return fullText;
}

export async function streamExplainCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  if (!checkRateLimit(ip)) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
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
}

export async function explainCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  if (!checkRateLimit(ip)) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
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

  return fullText;
}

export async function streamGenerateCode(prompt: string, userPrompt: string = "", ip: string = "unknown") {
  if (!checkRateLimit(ip)) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
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
}
