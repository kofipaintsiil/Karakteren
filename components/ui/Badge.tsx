type BadgeVariant = "default" | "coral" | "yellow" | "success" | "warning" | "error";

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default:  { backgroundColor: "var(--surface-2)", color: "var(--text-muted)", border: "2px solid var(--border)" },
  coral:    { backgroundColor: "var(--coral-soft)", color: "var(--coral-press)", border: "2px solid var(--coral-mid)" },
  yellow:   { backgroundColor: "var(--yellow-soft)", color: "oklch(0.44 0.15 82)", border: "2px solid var(--yellow)" },
  success:  { backgroundColor: "var(--green-soft)", color: "var(--green-press)", border: "2px solid var(--green)" },
  warning:  { backgroundColor: "var(--yellow-soft)", color: "oklch(0.44 0.15 82)", border: "2px solid var(--yellow)" },
  error:    { backgroundColor: "oklch(0.96 0.04 22)", color: "var(--error)", border: "2px solid oklch(0.80 0.10 22)" },
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      borderRadius: "var(--r-md)",
      padding: "4px 12px",
      fontSize: "13px",
      fontWeight: 800,
      lineHeight: 1.4,
      ...variantStyles[variant],
    }}>
      {children}
    </span>
  );
}
