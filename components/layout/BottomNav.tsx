"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookMarked, Users, User } from "lucide-react";

const tabs = [
  { href: "/dashboard", label: "Eksamen", icon: GraduationCap },
  { href: "/oving",     label: "Øving",   icon: BookMarked },
  { href: "/toppliste", label: "Sosial",  icon: Users },
  { href: "/profil",    label: "Profil",  icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomnav-mobile" style={{
      backgroundColor: "var(--surface)",
      borderTop: "2px solid var(--border)",
    }}>
      <div style={{ display: "flex", height: "60px", alignItems: "center", padding: "0 4px" }}>
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
                gap: "2px",
                padding: "5px 10px",
                borderRadius: "var(--r-full)",
                backgroundColor: active ? "var(--coral-soft)" : "transparent",
                color: active ? "var(--coral)" : "var(--text-faint)",
                transition: "background-color 150ms ease-out",
                minWidth: "56px",
              }}>
                <Icon size={19} strokeWidth={active ? 2.5 : 1.75} />
                <span style={{
                  fontSize: "9px",
                  fontWeight: active ? 700 : 600,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
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
