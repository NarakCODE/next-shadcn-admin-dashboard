"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface StepperContextValue {
  value: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  indicators?: {
    completed?: React.ReactNode;
    loading?: React.ReactNode;
  };
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined);

export function useStepper() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  indicators?: {
    completed?: React.ReactNode;
    loading?: React.ReactNode;
  };
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      children,
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      indicators,
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = React.useState(defaultValue ?? 1);
    const value = controlledValue ?? localValue;

    const handleValueChange = React.useCallback(
      (newValue: number) => {
        if (controlledValue === undefined) {
          setLocalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange],
    );

    const contextValue = React.useMemo(
      () => ({
        value,
        onValueChange: handleValueChange,
        orientation,
        indicators,
      }),
      [value, handleValueChange, orientation, indicators],
    );

    return (
      <StepperContext.Provider value={contextValue}>
        <div ref={ref} className={cn("flex flex-col gap-4", className)} data-orientation={orientation} {...props}>
          {children}
        </div>
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

export interface StepperNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export const StepperNav = React.forwardRef<HTMLDivElement, StepperNavProps>(
  ({ children, className, ...props }, ref) => {
    const { orientation } = useStepper();
    return (
      <div
        ref={ref}
        className={cn(
          "group/stepper-nav flex gap-4",
          orientation === "horizontal" ? "w-full flex-row items-center" : "flex-col items-start",
          className,
        )}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    );
  },
);
StepperNav.displayName = "StepperNav";

interface StepperItemContextValue {
  step: number;
  state: "completed" | "active" | "inactive" | "loading";
}

const StepperItemContext = React.createContext<StepperItemContextValue | undefined>(undefined);

export function useStepperItem() {
  const context = React.useContext(StepperItemContext);
  if (!context) {
    throw new Error("useStepperItem must be used within a StepperItem");
  }
  return context;
}

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  state?: "completed" | "active" | "inactive" | "loading";
}

export const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ children, className, step, state: customState, ...props }, ref) => {
    const { value } = useStepper();

    const state = React.useMemo(() => {
      if (customState) return customState;
      if (step < value) return "completed";
      if (step === value) return "active";
      return "inactive";
    }, [customState, step, value]);

    const contextValue = React.useMemo(() => ({ step, state }), [step, state]);

    return (
      <StepperItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "group/step relative flex flex-col gap-2 data-[state=active]:text-primary data-[state=completed]:text-primary data-[state=inactive]:text-muted-foreground",
            className,
          )}
          data-state={state}
          {...props}
        >
          {children}
        </div>
      </StepperItemContext.Provider>
    );
  },
);
StepperItem.displayName = "StepperItem";

export interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ children, className, type = "button", onClick, ...props }, ref) => {
    const { onValueChange } = useStepper();
    const { step, state } = useStepperItem();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        onValueChange?.(step);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "flex cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onClick={handleClick}
        data-state={state}
        {...props}
      >
        {children}
      </button>
    );
  },
);
StepperTrigger.displayName = "StepperTrigger";

export interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const { indicators } = useStepper();
    const { state } = useStepperItem();

    const renderContent = () => {
      if (state === "completed" && indicators?.completed) {
        return indicators.completed;
      }
      if (state === "loading" && indicators?.loading) {
        return indicators.loading;
      }
      return children;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border font-semibold text-xs transition-colors",
          state === "active" && "border-primary bg-primary text-primary-foreground",
          state === "completed" && "border-primary bg-primary/10 text-primary",
          state === "inactive" && "border-muted bg-muted text-muted-foreground",
          className,
        )}
        data-state={state}
        {...props}
      >
        {renderContent()}
      </div>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

export interface StepperTitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const StepperTitle = React.forwardRef<HTMLSpanElement, StepperTitleProps>(
  ({ children, className, ...props }, ref) => {
    const { state } = useStepperItem();
    return (
      <span
        ref={ref}
        className={cn(
          "font-medium text-sm transition-colors",
          state === "active" && "text-foreground",
          state === "completed" && "text-foreground",
          state === "inactive" && "text-muted-foreground",
          className,
        )}
        data-state={state}
        {...props}
      >
        {children}
      </span>
    );
  },
);
StepperTitle.displayName = "StepperTitle";

export interface StepperSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const StepperSeparator = React.forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { state } = useStepperItem();
    return (
      <div
        ref={ref}
        className={cn("h-0.5 w-full bg-muted transition-colors", state === "completed" && "bg-primary", className)}
        data-state={state}
        {...props}
      />
    );
  },
);
StepperSeparator.displayName = "StepperSeparator";

export interface StepperPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const StepperPanel = React.forwardRef<HTMLDivElement, StepperPanelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    );
  },
);
StepperPanel.displayName = "StepperPanel";

export interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  ({ children, className, value, ...props }, ref) => {
    const { value: activeValue } = useStepper();

    if (value !== activeValue) return null;

    return (
      <div ref={ref} className={cn("fade-in-50 w-full animate-in duration-200", className)} {...props}>
        {children}
      </div>
    );
  },
);
StepperContent.displayName = "StepperContent";
