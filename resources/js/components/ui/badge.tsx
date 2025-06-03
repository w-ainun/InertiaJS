import type * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90", // white
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground", // border
        ghost: // transparent
          "border-transparent bg-background/80 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        muted: "border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/80", // gray
        link: "border-transparent text-primary underline-offset-4 hover:underline [a&]:hover:bg-transparent", // underline hover
        destructive: // red
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        thick: "border-2 border-foreground/30 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground", //
        // New enhanced variants
        success: // green
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600 dark:bg-green-600 dark:[a&]:hover:bg-green-700",
        warning: // yellow/orange
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600 dark:bg-yellow-600 dark:[a&]:hover:bg-yellow-700",
        info: "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600 dark:bg-blue-600 dark:[a&]:hover:bg-blue-700", // blue
        purple: // purple for admin
          "border-transparent bg-purple-500 text-white [a&]:hover:bg-purple-600 dark:bg-purple-600 dark:[a&]:hover:bg-purple-700",
        orange: // orange for courier
          "border-transparent bg-orange-500 text-white [a&]:hover:bg-orange-600 dark:bg-orange-600 dark:[a&]:hover:bg-orange-700",
        cyan: "border-transparent bg-cyan-500 text-white [a&]:hover:bg-cyan-600 dark:bg-cyan-600 dark:[a&]:hover:bg-cyan-700", // cyan for client
        inactive: // gray for inactive
          "border-transparent bg-gray-400 text-white [a&]:hover:bg-gray-500 dark:bg-gray-500 dark:[a&]:hover:bg-gray-600",
        online: // green with pulse effect
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600 dark:bg-green-600 dark:[a&]:hover:bg-green-700 animate-pulse",
        offline: // gray
          "border-transparent bg-gray-400 text-white [a&]:hover:bg-gray-500 dark:bg-gray-500 dark:[a&]:hover:bg-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
