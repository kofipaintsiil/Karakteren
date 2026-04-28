"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Eksamen" },
  { href: "/toppliste", label: "Toppliste" },
  { href: "/pricing",   label: "Premium" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header style={{
      backgroundColor: "var(--surface)",
      borderBottom: "2px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 16px",
        height: "58px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{
            width: "32px", height: "32px",
            borderRadius: "var(--r-md)",
            backgroundColor: "var(--coral)",
            border: "2px solid var(--coral-press)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: "14px",
          }}>K</span>
          <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>Karakteren</span>
        </Link>

        {/* Shown on tablet/small desktop where sidebar isn't visible */}
        <nav className="hidden sm:flex md:hidden items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} style={{
                padding: "6px 14px",
                borderRadius: "var(--r-md)",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                backgroundColor: active ? "var(--coral-soft)" : "transparent",
                color: active ? "var(--coral)" : "var(--text-muted)",
                border: active ? "2px solid var(--coral-mid)" : "2px solid transparent",
              }}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/profil" style={{
          width: "36px", height: "36px",
          borderRadius: "var(--r-full)",
          backgroundColor: "var(--coral-soft)",
          border: "2px solid var(--coral-mid)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 800, color: "var(--coral-press)",
          textDecoration: "none",
        }}>
          P
        </Link>
      </div>
    </header>
  );
}
