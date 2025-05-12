"use client";

import { useState, useEffect } from "react";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote as MDXRemoteClient } from 'next-mdx-remote';
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx-components";
import { Copy, RefreshCw } from "lucide-react";

interface MDXContentProps {
  content: string;
  onRetry?: () => void;
}

export function MDXContent({ content, onRetry }: MDXContentProps) {
  const [mounted, setMounted] = useState(false);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyResponse = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setMounted(true);
    
    const processMdx = async () => {
      try {
        const mdxSource = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [[rehypeHighlight, { detect: true, ignoreMissing: true }]],
          }
        });
        setMdxSource(mdxSource);
        setError(null);
      } catch (err) {
        console.error("Error compiling MDX:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    
    processMdx();
  }, [content]);

  if (!mounted) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-900/20 rounded-md text-red-800 dark:text-red-200">
        <h3 className="font-semibold mb-2">MDX Compilation Error</h3>
        <pre className="whitespace-pre-wrap text-sm font-mono p-2 bg-red-100 dark:bg-red-900/30 rounded">
          {error}
        </pre>
        <p className="mt-2 text-sm">Please check your MDX content for syntax errors like unclosed brackets or tags.</p>
      </div>
    );
  }

  if (!mdxSource) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
          <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mdx-content prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border prose-pre:rounded-md prose-pre:p-4">
        <MDXRemoteClient {...mdxSource} components={mdxComponents} />
        <div className="flex items-center gap-2 p-1 w-fit mt-1">
          <button
            onClick={handleCopyResponse}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
            aria-label="Copy response"
            title="Copy response"
          >
            <Copy size={16} className={copied ? "text-green-400" : ""} />
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
              aria-label="Retry"
              title="Retry"
            >
              <RefreshCw size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 