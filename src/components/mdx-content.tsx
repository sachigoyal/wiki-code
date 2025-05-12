"use client";

import { useState, useEffect } from "react";
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote as MDXRemoteClient } from 'next-mdx-remote';
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx-components";

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  const [mounted, setMounted] = useState(false);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="mdx-content prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:border prose-pre:rounded-md prose-pre:p-4">
      <MDXRemoteClient {...mdxSource} components={mdxComponents} />
    </div>
  );
} 