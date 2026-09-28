import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

// تعريف العناصر بشكل صريح لتجنب أخطاء TypeScript
const tags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

export function Heading({ level = 2, className, children }: HeadingProps) {
  const Tag = tags[level];
  
  const sizes = {
    1: "text-3xl md:text-4xl font-bold text-foreground",
    2: "text-2xl md:text-3xl font-semibold text-foreground",
    3: "text-xl md:text-2xl font-semibold text-foreground",
    4: "text-lg md:text-xl font-medium text-foreground",
  };
  
  return (
    <Tag className={cn(sizes[level], className)}>
      {children}
    </Tag>
  );
}