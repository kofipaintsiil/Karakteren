import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "success" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { base: React.CSSProperties; shadow: string }> = {
  primary: {
    base: { backgroundColor: "var(--coral)", color: "#fff", border: "none" },
    shadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)",
  },
  secondary: {
    base: { backgroundColor: "var(--surface)", color: "var(--text)", border: "1.5px solid var(--border-dark)" },
    shadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  ghost: {
    base: { backgroundColor: "transparent", color: "var(--text-muted)", border: "none" },
    shadow: "none",
  },
  success: {
    base: { backgroundColor: "var(--green)", color: "#fff", border: "none" },
    shadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  destructive: {
    base: { backgroundColor: "var(--error)", color: "#fff", border: "none" },
    shadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { height: "36px", padding: "0 16px", fontSize: "13px", borderRadius: "var(--r-full)" },
  md: { height: "48px", padding: "0 24px", fontSize: "15px", borderRadius: "var(--r-full)" },
  lg: { height: "56px", padding: "0 32px", fontSize: "16px", borderRadius: "var(--r-full)" },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth, children, style, className = "", ...props },
  ref
) {
  const { base, shadow } = variantStyles[variant];
  const isGhost = variant === "ghost";

  return (
    <button
      ref={ref}
      className={`btn-3d ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontFamily: "inherit",
        fontWeight: 700,
        letterSpacing: "0.01em",
        cursor: "pointer",
        width: fullWidth ? "100%" : undefined,
        boxShadow: isGhost ? "none" : shadow,
        ...base,
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
