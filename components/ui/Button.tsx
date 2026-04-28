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
    base: { backgroundColor: "var(--coral)", color: "#fff", border: "2px solid var(--coral-press)" },
    shadow: "0 4px 0 var(--coral-press)",
  },
  secondary: {
    base: { backgroundColor: "var(--surface)", color: "var(--text)", border: "2px solid var(--border-dark)" },
    shadow: "0 4px 0 var(--border-dark)",
  },
  ghost: {
    base: { backgroundColor: "transparent", color: "var(--text-muted)", border: "2px solid transparent" },
    shadow: "none",
  },
  success: {
    base: { backgroundColor: "var(--green)", color: "#fff", border: "2px solid var(--green-press)" },
    shadow: "0 4px 0 var(--green-press)",
  },
  destructive: {
    base: { backgroundColor: "var(--error)", color: "#fff", border: "2px solid oklch(0.43 0.20 22)" },
    shadow: "0 4px 0 oklch(0.43 0.20 22)",
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { height: "38px", padding: "0 16px", fontSize: "13px", borderRadius: "var(--r-md)" },
  md: { height: "48px", padding: "0 22px", fontSize: "15px", borderRadius: "var(--r-lg)" },
  lg: { height: "56px", padding: "0 28px", fontSize: "16px", borderRadius: "var(--r-xl)" },
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
