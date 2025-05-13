"use client";

import { useState, useEffect } from "react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ModeToggle } from "@/components/mode-toggle";
import { CodeXml, Loader2, Settings, Text, RefreshCw, Send, AlertTriangle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { streamRefactorCode, streamExplainCode, streamGenerateCode } from "@/actions";
import { MDXContent } from "@/components/mdx-content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [code, setCode] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [clientIp, setClientIp] = useState<string>("unknown");

  const [explanationLoading, setExplanationLoading] = useState(false);
  const [refactoringLoading, setRefactoringLoading] = useState(false);
  const [generatingCodeLoading, setGeneratingCodeLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<{ type: "rate-limit" | "general" | null; message: string }>({ 
    type: null, 
    message: "" 
  });
  const [lastAction, setLastAction] = useState<"explain" | "refactor" | "generate" | null>(null);
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => setClientIp(data.ip))
      .catch(error => console.error("Failed to fetch IP:", error));
  }, []);

  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  const handleError = (errorMessage: string) => {
    if (errorMessage.includes("Rate limit exceeded")) {
      setError({ 
        type: "rate-limit", 
        message: "Rate limit exceeded. Please wait a minute before trying again." 
      });

      const timeout = window.setTimeout(() => {
        setError({ type: null, message: "" });
      }, 60000);
      
      setRetryTimeout(timeout);
    } else if (errorMessage.includes("API key")) {
      setError({
        type: "general",
        message: "Server configuration issue. Please try again later or contact support."
      });
    } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
      setError({
        type: "general",
        message: "Network error. Please check your connection and try again."
      });
    } else {
      setError({
        type: "general", 
        message: "Something went wrong. Please try again later."
      });
      
      console.error("Original error:", errorMessage);
    }
  };

  const handleStreamResponse = async (stream: ReadableStream, actionType: "explain" | "refactor" | "generate") => {
    let resultText = "";
    
    try {
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = typeof value === 'string' ? value : decoder.decode(value);
        resultText += text;
        setResult(resultText);
      }
      
      // Verify the MDX content has balanced braces
      const openBraces = (resultText.match(/{/g) || []).length;
      const closeBraces = (resultText.match(/}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        console.warn("Unbalanced braces in MDX response. Fixing by appending closing braces.");
        for (let i = 0; i < openBraces - closeBraces; i++) {
          resultText += "}";
        }
        setResult(resultText);
      }
      
      return true;
    } catch (error) {
      console.error(`${actionType} failed:`, error);
      const errorMessage = error instanceof Error ? error.message : `Error occurred during ${actionType}.`;
      handleError(errorMessage);
      return false;
    }
  };

  const handleRefactor = async () => {
    setRefactoringLoading(true);
    setResult("");
    setError({ type: null, message: "" });
    setLastAction("refactor");

    try {
      const stream = await streamRefactorCode(code, userPrompt, clientIp);
      await handleStreamResponse(stream, "refactor");
    } catch (error) {
      console.error("Refactoring failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error occurred during refactoring.";
      handleError(errorMessage);
    } finally {
      setRefactoringLoading(false);
    }
  };

  const handleExplanation = async () => {
    setExplanationLoading(true);
    setResult("");
    setError({ type: null, message: "" });
    setLastAction("explain");

    try {
      const stream = await streamExplainCode(code, userPrompt, clientIp);
      await handleStreamResponse(stream, "explain");
    } catch (error) {
      console.error("Explanation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error occurred during explanation.";
      handleError(errorMessage);
    } finally {
      setExplanationLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setGeneratingCodeLoading(true);
    setResult("");
    setError({ type: null, message: "" });
    setLastAction("generate");

    try {
      const stream = await streamGenerateCode(code, userPrompt, clientIp);
      await handleStreamResponse(stream, "generate");
    } catch (error) {
      console.error("Generating code failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Error occurred during generating code.";
      handleError(errorMessage);
    } finally {
      setGeneratingCodeLoading(false);
    }
  };

  const handleRetry = () => {
    if (error.type === "rate-limit") {
      return; // Don't allow retry if rate limited
    }
    
    setError({ type: null, message: "" });
    
    if (lastAction === "explain") {
      handleExplanation();
    } else if (lastAction === "refactor") {
      handleRefactor();
    } else if (lastAction === "generate") {
      handleGenerateCode();
    }
  };

  const handleReset = () => {
    setCode("");
    setUserPrompt("");
    setResult("");
    setError({ type: null, message: "" });
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      setRetryTimeout(null);
    }
  };

  const isLoading = explanationLoading || refactoringLoading || generatingCodeLoading;
  const isDisabled = isLoading || error.type === "rate-limit";

  const renderErrorContent = () => {
    if (error.type === "rate-limit") {
      return (
        <Alert variant="destructive" className="mb-4">
          <Clock className="h-4 w-4" />
          <AlertTitle>Rate Limit Exceeded</AlertTitle>
          <AlertDescription>
            {error.message}
            <div className="mt-2">
              <Button variant="outline" size="sm" disabled className="animate-pulse">
                Cooldown in progress...
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    } else if (error.type === "general") {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen flex flex-col font-sans gap-5 overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full mt-5 px-4">
          <div className="flex-1"></div>
          <AnimatedShinyText className="flex items-center justify-center gap-3 text-6xl font-semibold tracking-tight">
            <CodeXml size={60} />
            WikiCode
          </AnimatedShinyText>
          <div className="flex-1 flex justify-end">
            <ModeToggle />
          </div>
        </div>
        <div className="text-muted-foreground mt-2 ml-6 text-lg italic ">
          A simple wiki for all your code explanations
        </div>
      </div>
      <div className="flex-1 container mx-auto p-4 max-w-7xl rounded-md flex flex-col overflow-hidden">
        <div className="grid grid-cols-2 gap-4 h-full flex-1 overflow-hidden">
          <Card className="p-4 flex flex-col hover:shadow-md overflow-y-auto">
            <div className="flex items-end gap-2">
              <div className="w-full">
                <Label htmlFor="user-prompt" className="mb-2 block">Write a prompt to generate code</Label>
                <Input
                  id="user-prompt"
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  placeholder="Add custom instructions for refactoring or explanation"
                  className="w-full"
                />
              </div>
              <Button onClick={handleGenerateCode} disabled={isDisabled}>
                {generatingCodeLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </Button>
            </div>
            <Textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code snippets here"
              className="h-full w-full resize-none font-mono"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1" onClick={handleRefactor} disabled={isDisabled}>
                {refactoringLoading ? <Loader2 className="animate-spin mr-2" /> : <Settings size={16} className="mr-2" />}
                {refactoringLoading ? "Refactoring..." : "Refactor Code"}
              </Button>
              <Button className="flex-1" onClick={handleExplanation} disabled={isDisabled}>
                {explanationLoading ? <Loader2 className="animate-spin mr-2" /> : <Text size={16} className="mr-2" />}
                {explanationLoading ? "Explaining..." : "Explain Code"}
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RefreshCw size={16} />
              </Button>
            </div>
          </Card>
          <Card className="p-4 text-sm hover:shadow-md overflow-y-auto">
            {error.type ? (
              renderErrorContent()
            ) : isLoading && result === "" ? (
              <div className="h-full flex flex-col justify-end">
                <Button variant="outline" className="animate-pulse mx-auto w-fit">Waiting for response...</Button>
              </div>
            ) : result ? (
              <MDXContent content={result} onRetry={handleRetry} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-700 to-slate-400 rounded-full blur opacity-30 group-hover:opacity-100 transition"></div>
                  <CodeXml size={48} className="relative opacity-80 transition-all hover:opacity-100" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-lg font-medium">Ready to analyze your code</p>
                  <p className="text-sm opacity-80">Paste your code snippet and let AI assist you</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
