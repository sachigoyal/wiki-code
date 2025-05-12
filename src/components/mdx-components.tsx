import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CustomLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const href = props.href;
  const isInternalLink = href && href.startsWith('/');

  if (isInternalLink) {
    return <Link {...props} href={href} className={cn("text-primary underline underline-offset-4 hover:text-primary/80", props.className)} />;
  }

  return <a {...props} target="_blank" rel="noopener noreferrer" className={cn("text-primary underline underline-offset-4 hover:text-primary/80", props.className)} />;
};

const CustomImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <Image
        alt={props.alt || "Image"}
        src={props.src as string}
        width={700}
        height={350}
        style={{ height: "auto" }}
        className="w-full"
      />
    </div>
  );
};

const Heading1 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 {...props} className={cn("mt-10 scroll-m-20 text-4xl font-bold tracking-tight", props.className)}>
    {children}
  </h1>
);

const Heading2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 {...props} className={cn("mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight", props.className)}>
    {children}
  </h2>
);

const Heading3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...props} className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", props.className)}>
    {children}
  </h3>
);

const CodeBlock = ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
  <pre {...props} className={cn("my-3 overflow-x-auto rounded-lg", className)}>
    {children}
  </pre>
);

const Code = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <code {...props} className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", props.className)}>
    {children}
  </code>
);

const Paragraph = ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)}>
    {children}
  </p>
);

const List = ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul {...props} className={cn("my-6 ml-6 list-disc [&>li]:mt-2", props.className)}>
    {children}
  </ul>
);

const OrderedList = ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
  <ol {...props} className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", props.className)}>
    {children}
  </ol>
);

export const mdxComponents = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  a: CustomLink,
  p: Paragraph,
  ul: List,
  ol: OrderedList,
  img: CustomImage,
  pre: CodeBlock,
  code: Code,
}; 