"use client";

import { useState } from "react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ModeToggle } from "@/components/mode-toggle";
import { CodeXml, Loader2, Settings, Text, RefreshCw, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { streamRefactorCode, streamExplainCode, streamGenerateCode } from "@/actions";
import { MDXContent } from "@/components/mdx-content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [code, setCode] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  const [explanationLoading, setExplanationLoading] = useState(false);
  const [refactoringLoading, setRefactoringLoading] = useState(false);
  const [generatingCodeLoading, setGeneratingCodeLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleRefactor = async () => {
    setRefactoringLoading(true);
    setResult("");

    try {
      const stream = await streamRefactorCode(code, userPrompt);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = typeof value === 'string' ? value : decoder.decode(value);
        setResult(prev => prev + text);
      }
    } catch (error) {
      console.error("Refactoring failed:", error);
      setResult("Error occurred during refactoring.");
    } finally {
      setRefactoringLoading(false);
    }
  };

  const handleExplanation = async () => {
    setExplanationLoading(true);
    setResult("");

    try {
      const stream = await streamExplainCode(code, userPrompt);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = typeof value === 'string' ? value : decoder.decode(value);
        setResult(prev => prev + text);
      }
    } catch (error) {
      console.error("Explanation failed:", error);
      setResult("Error occurred during explanation.");
    } finally {
      setExplanationLoading(false);
    }
  };



  const handleGenerateCode = async () => {
    setGeneratingCodeLoading(true);
    setResult("");

    try {
      const stream = await streamGenerateCode(code, userPrompt);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = typeof value === 'string' ? value : decoder.decode(value);
        setResult(prev => prev + text);
      }
    } catch (error) {
      console.error("Generating code failed:", error);
      setResult("Error occurred during generating code.");
    } finally {
      setGeneratingCodeLoading(false);
    }
  };

  const handleReset = () => {
    setCode("");
    setUserPrompt("");
    setResult("");
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
              <Button onClick={handleGenerateCode}>
                <Send size={16} />
              </Button>
            </div>
            <Textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code snippets here"
              className="h-full w-full resize-none font-mono"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1" onClick={handleRefactor} disabled={refactoringLoading || explanationLoading}>
                {refactoringLoading ? <Loader2 className="animate-spin mr-2" /> : <Settings size={16} className="mr-2" />}
                {refactoringLoading ? "Refactoring..." : "Refactor Code"}
              </Button>
              <Button className="flex-1" onClick={handleExplanation} disabled={explanationLoading || refactoringLoading}>
                {explanationLoading ? <Loader2 className="animate-spin mr-2" /> : <Text size={16} className="mr-2" />}
                {explanationLoading ? "Explaining..." : "Explain Code"}
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RefreshCw size={16} />
              </Button>
            </div>
          </Card>
          <Card className="p-4 text-sm hover:shadow-md overflow-y-auto">
            {(explanationLoading || refactoringLoading || generatingCodeLoading) && result === "" ? (
              <div className="h-full flex flex-col justify-end">
                <Button variant="outline" className="animate-pulse mx-auto w-fit">Waiting for response...</Button>
              </div>
            ) : result ? (
              <MDXContent content={result} />
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
