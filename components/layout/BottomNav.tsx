"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Blobb from "@/components/Blobb";
import { useLang } from "@/components/LangProvider";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 4L21 12V20C21 20.5523 20.5523 21 20 21H15V16H9V21H4C3.44772 21 3 20.5523 3 20V12Z"
        fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.18 : 0}
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0}
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M9 7h7M9 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function BlobbTabIcon({ active }: { active: boolean }) {
  return <Blobb mood={active ? "happy" : "idle"} size={26} animate={false} />;
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8"
        fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M2 20C2 17 5.13 15 9 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"
        fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M14 20C14 17.8 15.3 16 17 16C18.7 16 20 17.8 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"
        fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
      <path d="M5 19C5 16.2386 8.13401 14 12 14C15.866 14 19 16.2386 19 19"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  const tabs = [
    { href: "/dashboard", label: t("nav_home"),    icon: HomeIcon },
    { href: "/oving",     label: t("nav_topics"),  icon: BookIcon },
    { href: "/eksamen",   label: t("nav_exam"),    icon: BlobbTabIcon },
    { href: "/toppliste", label: t("nav_social"),  icon: UsersIcon },
    { href: "/profil",    label: t("nav_profile"), icon: ProfileIcon },
  ];

  const activeIdx = tabs.findIndex(t => pathname.startsWith(t.href));

  return (
    <nav className="bottomnav-mobile" style={{
      backgroundColor: "rgba(250,248,244,0.94)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderTop: "1px solid rgba(0,0,0,0.08)",
    }}>
      {/* Slide indicator */}
      <div style={{
        height: "2px",
        backgroundColor: "var(--accent)",
        width: "20%",
        borderRadius: "0 0 2px 2px",
        transform: `translateX(${Math.max(0, activeIdx) * 100}%)`,
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
      }} />

      <div style={{ display: "flex", height: "56px", alignItems: "center" }}>
        {tabs.map(({ href, label, icon: Icon }, i) => {
          const active = activeIdx === i;
          return (
            <Link key={href} href={href} style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              textDecoration: "none",
              color: active ? "var(--accent-dark)" : "var(--ink-light)",
              fontSize: "9.5px",
              fontWeight: active ? 600 : 400,
              fontFamily: "Inter, system-ui, sans-serif",
              padding: "4px 0 6px",
              transition: "color 0.15s ease",
              WebkitTapHighlightColor: "transparent",
            }}>
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </div>
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
