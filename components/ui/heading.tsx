import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-heading tracking-tight transition-colors",
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
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
      align: "left",
      weight: "bold",
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
  ({ className, align, weight, asChild = false, as = "h1", ...props }, ref) => {
    const Comp = asChild ? Slot.Root : as
    return (
      <Comp
        className={cn(headingVariants({ align, weight, className }))}
        ref={ref as any}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }
