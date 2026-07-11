import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-heading tracking-tight transition-colors",
  {
    variants: {
      level: {
        h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        h2: "scroll-m-20 border-b border-border pb-2 text-3xl font-semibold first:mt-0",
        h3: "scroll-m-20 text-2xl font-semibold",
        h4: "scroll-m-20 text-xl font-semibold",
        h5: "scroll-m-20 text-lg font-semibold",
        h6: "scroll-m-20 text-base font-semibold",
      },
      gradient: {
        true: "bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent",
        primary: "bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent",
        accent: "bg-gradient-to-r from-accent to-accent-foreground bg-clip-text text-transparent",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      level: "h1",
      align: "left",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h1", gradient, align, asChild = false, as, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : as || level || "h1"
    return (
      <Comp
        className={cn(headingVariants({ level, gradient, align, className }))}
        ref={ref as any}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
