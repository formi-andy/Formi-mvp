import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground disabled:bg-primary hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground disabled:bg-destructive hover:bg-destructive/90",
        outline:
          "border border-input bg-background border-primary disabled:bg-background disabled:text-primary disabled:border-input hover:bg-accent hover:text-accent-foreground",
        "outline-action":
          "border border-input bg-background border-primary disabled:bg-background disabled:text-primary disabled:border-input hover:border-blue-500 hover:bg-blue-500 hover:text-white",
        "outline-danger":
          "border border-input bg-background border-primary disabled:bg-background disabled:text-primary disabled:border-input hover:border-red-500 hover:bg-red-500 hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-blue-500 underline-offset-4 hover:underline",
        action:
          "bg-blue-500 text-white disabled:text-zinc-400 hover:bg-blue-600 disabled:bg-zinc-200",
        danger:
          "bg-red-500 text-white disabled:text-zinc-400 hover:bg-red-600 disabled:bg-zinc-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
