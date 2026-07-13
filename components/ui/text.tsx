import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const textVariants = cva("font-sans transition-colors", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      lead: "text-xl text-muted-foreground font-normal",
      large: "text-lg font-semibold text-foreground",
      small: "text-sm font-medium leading-none text-foreground",
      xs: "text-xs font-medium leading-none text-foreground",
      blockquote:
        "mt-6 border-l-2 border-border pl-6 italic text-muted-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "left",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  asChild?: boolean;
  as?: "p" | "span" | "div" | "blockquote" | "code";
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { className, variant, align, weight, asChild = false, as = "p", ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : as;
    return (
      <Comp
        className={cn(textVariants({ variant, align, weight, className }))}
        ref={ref as any}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, textVariants };
