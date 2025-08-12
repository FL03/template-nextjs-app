/**
 * Created At: 2025.07.27:13:14:02
 * @author - @FL03
 * @file - mdx-components.tsx
 */
// imports
import type { MDXComponents } from "mdx/types";
// project
import { cn } from "@/lib/utils";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1
        className="text-3xl font-bold leading-relaxed tracking-tight"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-2xl font-semibold leading-relaxed tracking-tight"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-xl font-semibold leading-relaxed tracking-tight"
        {...props}
      />
    ),
    h4: (props) => <h4 className="text-lg font-medium" {...props} />,
    h5: (props) => <h5 className="text-base font-light underline" {...props} />,
    h6: (props) => <h6 className="text-sm font-thin italic" {...props} />,
    p: (props) => <p className="text-base text-foreground" {...props} />,
    a: (props) => (
      <a
        className={cn(
          "tet-base text-primary transition-all duration-300 ease-in-out",
          "hover:cursor-pointer hover:italic hover:underline hover:text-primary/30 hover:text-shadow-primary/40",
        )}
        {...props}
      />
    ),
    ul: (props) => (
      <ul className="list-disc inline-flex flex-col peer:pl-5" {...props} />
    ),
    ol: (props) => (
      <ol className="list-decimal inline-flex flex-col peer:pl-5" {...props} />
    ),
    li: (props) => <li className="text-base text-foreground" {...props} />,
    blockquote: (props) => (
      <blockquote className="text-primary italic border-l-4 pl-4" {...props} />
    ),
    code: (props) => (
      <code
        className={cn(
          "bg-primary text-primary-foreground border-primary/10 p-1 rounded-lg w-full",
          "hover:bg-primary/90 hover:ring hover:ring-primary/10 hover:ring-offset-2",
          "transition-all duration-300 ease-in-out",
        )}
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="text-primary-foreground bg-primary/90 border-primary/10 p-4 rounded overflow-x-auto"
        {...props}
      />
    ),
    img: (props) => <img className="max-w-full h-auto" {...props} />,
    table: (props) => (
      <table
        className="min-w-full border-collapse bg-transparent text-foreground container mx-auto"
        {...props}
      />
    ),
    th: (props) => (
      <th className="border border-b-2 px-4 py-2 font-semibold" {...props} />
    ),
    td: (props) => <td className="border px-4 py-2" {...props} />,
    hr: (props) => <hr className="my-4 border-primary/20" {...props} />,
  };
}
