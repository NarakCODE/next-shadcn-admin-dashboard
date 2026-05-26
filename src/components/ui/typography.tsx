import { cn } from "@/lib/utils";

type TypographyProps = {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "blockquote" | "lead" | "large" | "small" | "muted" | "list" | "ordered-list" | "code" | "inline-code";
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

const variants: Record<NonNullable<TypographyProps["variant"]>, string> = {
  h1: "scroll-m-20 font-heading text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 font-heading text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 font-heading text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 font-heading text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 font-heading text-lg font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  lead: "text-muted-foreground text-xl",
  large: "font-semibold text-lg",
  small: "text-sm font-medium leading-none",
  muted: "text-muted-foreground text-sm",
  list: "my-6 ml-6 list-disc [&>li]:mt-2",
  "ordered-list": "my-6 ml-6 list-decimal [&>li]:mt-2",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  "inline-code": "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
};

export function Typography({ variant = "p", className, children, ...props }: TypographyProps) {
  const Component = variant === "ordered-list" ? "ol" : variant === "list" ? "ul" : variant;

  return (
    <Component
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
