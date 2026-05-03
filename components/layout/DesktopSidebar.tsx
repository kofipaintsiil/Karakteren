"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Blobb from "@/components/Blobb";
import { useLang } from "@/components/LangProvider";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  const links = [
    {
      href: "/dashboard", label: t("nav_home"),
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 4L21 12V20C21 20.5523 20.5523 21 20 21H15V16H9V21H4C3.44772 21 3 20.5523 3 20V12Z"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      href: "/oving", label: t("nav_topics"),
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M9 7h7M9 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: "/eksamen", label: t("nav_exam"),
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z"
            stroke="currentColor" strokeWidth="1.8" />
          <circle cx="9.5" cy="11.5" r="1.2" fill="currentColor" />
          <circle cx="14.5" cy="11.5" r="1.2" fill="currentColor" />
          <path d="M9 14.5C9 14.5 10.5 16 12 16C13.5 16 15 14.5 15 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      href: "/toppliste", label: t("nav_social"),
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M2 20C2 17 5.13 15 9 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M14 20C14 17.8 15.3 16 17 16C18.7 16 20 17.8 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: "/profil", label: t("nav_profile"),
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 19C5 16.2386 8.13401 14 12 14C15.866 14 19 16.2386 19 19"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      paddingTop: "24px",
      paddingRight: "24px",
      position: "sticky",
      top: "58px",
      height: "calc(100vh - 58px)",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    }} className="sidebar-desktop">

      {/* Blobb + branding */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 14px 16px" }}>
        <Blobb state="idle" size={36} animate />
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "15px", color: "var(--text)", letterSpacing: "-0.3px" }}>
          Karakteren
        </span>
      </div>

      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "var(--r-full)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: active ? 600 : 500,
            backgroundColor: active ? "var(--accent-bg)" : "transparent",
            color: active ? "var(--accent-dark)" : "var(--text-muted)",
            transition: "background-color 150ms ease-out, color 150ms ease-out",
          }}>
            <Icon />
            {label}
          </Link>
        );
      })}

      {/* Settings at the bottom */}
      <div style={{ flex: 1 }} />
      <Link href="/instillinger" style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "var(--r-full)",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: pathname.startsWith("/instillinger") ? 600 : 500,
        backgroundColor: pathname.startsWith("/instillinger") ? "var(--accent-bg)" : "transparent",
        color: pathname.startsWith("/instillinger") ? "var(--accent-dark)" : "var(--text-muted)",
        transition: "background-color 150ms ease-out, color 150ms ease-out",
        marginBottom: "16px",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {t("nav_settings")}
      </Link>
    </aside>
  );
}
