"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Fag",    icon: BookOpen },
  { href: "/toppliste", label: "Sosial",  icon: Users },
  { href: "/profil",    label: "Profil",  icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40" style={{
      backgroundColor: "var(--surface)",
      borderTop: "2px solid var(--border)",
    }}>
      <div style={{ display: "flex", height: "64px", alignItems: "center", padding: "0 8px" }}>
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              textDecoration: "none",
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                padding: "6px 20px",
                borderRadius: "var(--r-full)",
                backgroundColor: active ? "var(--coral-soft)" : "transparent",
                color: active ? "var(--coral)" : "var(--text-faint)",
                transition: "background-color 150ms ease-out",
                minWidth: "64px",
              }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                <span style={{
                  fontSize: "10px",
                  fontWeight: active ? 700 : 600,
                  lineHeight: 1,
                }}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
