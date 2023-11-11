"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { LuCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const checkboxVariants = cva(
  "peer shrink-0 bg-lightblue rounded-sm border border-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=checked]:text-primary-foreground",
  {
    variants: {
      variant: {},
      size: {
        default: "h-4 w-4",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const checkmarkVariants = cva("", {
  variants: {
    variant: {},
    size: {
      default: "h-4 w-4",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      checkboxVariants({
        variant,
        size,
        className,
      })
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <LuCheck
        className={cn(
          checkmarkVariants({
            size,
            className,
          })
        )}
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
