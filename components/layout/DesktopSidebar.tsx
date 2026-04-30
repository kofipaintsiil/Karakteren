"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Users, User, Sparkles, Settings } from "lucide-react";
import Blobb from "@/components/Blobb";

const links = [
  { href: "/dashboard",    label: "Fag",          icon: BookOpen },
  { href: "/toppliste",    label: "Sosial",        icon: Users },
  { href: "/profil",       label: "Profil",        icon: User },
  { href: "/instillinger", label: "Innstillinger", icon: Settings },
  { href: "/pricing",      label: "Premium",       icon: Sparkles },
];

export default function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "200px",
      flexShrink: 0,
      paddingTop: "24px",
      paddingRight: "24px",
      position: "sticky",
      top: "58px",
      height: "calc(100vh - 58px)",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }} className="sidebar-desktop">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
        <Blobb state="idle" size={56} />
      </div>

      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "var(--r-md)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 700,
            backgroundColor: active ? "var(--coral-soft)" : "transparent",
            color: active ? "var(--coral-press)" : "var(--text-muted)",
            border: active ? "2px solid var(--coral-mid)" : "2px solid transparent",
            transition: "background-color 150ms ease-out",
          }}>
            <Icon size={18} strokeWidth={active ? 2.5 : 1.75} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
