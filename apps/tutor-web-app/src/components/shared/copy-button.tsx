"use client";

import type React from "react";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  color?: string;
  copyFunc: () => Promise<void>;
}

export function CopyButton({
  text,
  className,
  variant = "outline",
  size = "default",
  color = "teal",
  copyFunc,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await copyFunc();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        `border-${color}-500 text-${color}-600 hover:bg-${color}-50 hover:text-${color}-700 focus:ring-${color}-500/40`,
        "transition-all duration-200",
        className
      )}
      {...props}
    >
      {text}
      {isCopied ? (
        <Check className="h-4 w-4 ml-2" />
      ) : (
        <Copy className="h-4 w-4 ml-2" />
      )}
    </Button>
  );
}
