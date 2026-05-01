"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookMarked, Users, User, Settings } from "lucide-react";

const tabs = [
  { href: "/dashboard",    label: "Eksamen", icon: GraduationCap },
  { href: "/oving",        label: "Øving",   icon: BookMarked },
  { href: "/toppliste",    label: "Sosial",  icon: Users },
  { href: "/profil",       label: "Profil",  icon: User },
  { href: "/instillinger", label: "Innstill.", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomnav-mobile" style={{
      backgroundColor: "rgba(250,248,244,0.92)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderTop: "1px solid rgba(0,0,0,0.07)",
    }}>
      <div style={{ display: "flex", height: "62px", alignItems: "center", padding: "0 8px" }}>
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
                padding: "6px 10px",
                borderRadius: "var(--r-md)",
                backgroundColor: active ? "var(--coral-soft)" : "transparent",
                color: active ? "var(--coral)" : "var(--text-faint)",
                transition: "background-color 150ms ease-out",
                minWidth: "52px",
              }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                <span style={{
                  fontSize: "9.5px",
                  fontWeight: active ? 700 : 500,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.01em",
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
