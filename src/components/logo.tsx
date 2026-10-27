import { cn } from "@/lib/cn";
import Link from "next/link";

type LogoProps = {
  variant?: "lockup" | "mark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  inverted?: boolean;
};

export function Logo({
  variant = "lockup",
  size = "md",
  href = "/",
  className,
  inverted = false,
}: LogoProps) {
  const ink = inverted ? "text-[var(--text-on-accent)]" : "text-[var(--text-primary)]";
  const mute = inverted ? "text-[var(--text-on-accent)]" : "text-[var(--text-secondary)]";
  const line = inverted ? "bg-[var(--text-on-accent)]" : "bg-[var(--accent-default)]";

  if (variant === "mark") {
    const px = size === "sm" ? 32 : size === "lg" ? 64 : 48;
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center",
          inverted && "bg-[var(--accent-default)] rounded-[var(--radius-md)]",
          className,
        )}
        style={{ width: px, height: px }}
        aria-label="MPB"
      >
        <span className="relative inline-flex items-baseline" style={{ gap: "0.24em" }}>
          <span
            className={cn("absolute left-0 w-[1.5px]", line)}
            style={{
              top: "-0.11em",
              bottom: "-0.11em",
            }}
            aria-hidden
          />
          <span
            className={cn("font-serif leading-none", ink)}
            style={{ fontSize: px * 0.55, paddingLeft: "0.24em" }}
          >
            M
          </span>
        </span>
      </span>
    );
  }

  const wordmarkSize = size === "sm" ? 24 : size === "lg" ? 40 : 32;
  const content = (
    <span className={cn("inline-flex flex-col items-start", className)}>
      <span
        className="relative inline-flex items-baseline"
        style={{ gap: "0.24em" }}
      >
        <span
          className={cn("absolute left-0", line)}
          style={{
            width: size === "sm" ? 1.5 : 2,
            top: "-0.11em",
            bottom: "-0.11em",
          }}
          aria-hidden
        />
        <span
          className={cn("font-serif leading-none", ink)}
          style={{
            fontSize: wordmarkSize,
            lineHeight: `${wordmarkSize + 8}px`,
            paddingLeft: "0.24em",
          }}
        >
          MPB
        </span>
      </span>
      <span
        className={cn(
          "font-mono-caps mt-[2px] whitespace-nowrap",
          mute,
        )}
        style={{
          paddingLeft: "0.24em",
          fontSize: size === "sm" ? 9 : 12,
          letterSpacing: "0.14em",
        }}
      >
        My Personal Brag
      </span>
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="no-underline focus-visible:rounded-[var(--radius-sm)]">
      {content}
    </Link>
  );
}
