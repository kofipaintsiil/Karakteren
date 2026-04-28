"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";

const SECTIONS = ["/dashboard", "/toppliste", "/profil"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [dragX, setDragX] = useState(0);
  const [snapping, setSnapping] = useState(false);

  const currentIndex = SECTIONS.findIndex((s) => pathname.startsWith(s));

  const navigate = useCallback(
    (dir: "left" | "right") => {
      if (currentIndex === -1) return;
      const next = dir === "left" ? currentIndex + 1 : currentIndex - 1;
      if (next < 0 || next >= SECTIONS.length) return;
      router.push(SECTIONS[next]);
    },
    [currentIndex, router]
  );

  // Reset drag and play slide-in animation when pathname changes
  useEffect(() => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setDragX(0);
    setSnapping(false);

    const el = wrapRef.current;
    if (!el) return;
    const currIdx = SECTIONS.findIndex((s) => pathname.startsWith(s));
    if (currIdx === -1) { prevPathname.current = pathname; return; }
    const prevIdx = SECTIONS.findIndex((s) => prevPathname.current.startsWith(s));
    prevPathname.current = pathname;
    if (prevIdx === -1 || prevIdx === currIdx) return;

    const dir = currIdx > prevIdx ? "right" : "left";
    el.classList.remove("slide-from-right", "slide-from-left");
    void el.offsetWidth;
    el.classList.add(`slide-from-${dir}`);
    const t = setTimeout(() => el.classList.remove("slide-from-right", "slide-from-left"), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  // Native touch events — must be non-passive for touchmove preventDefault
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || currentIndex === -1) return;

    let startX = 0;
    let startY = 0;
    let locked: "h" | "v" | null = null;

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      locked = null;
      setSnapping(false);
      if (navTimerRef.current) {
        clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }
    }

    function onTouchMove(e: TouchEvent) {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // Lock direction once we know which axis the user is moving
      if (!locked && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
        locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }

      if (locked !== "h") return;
      e.preventDefault(); // stop vertical scroll while horizontal swiping

      // Rubber-band resistance at the first and last section
      const atStart = currentIndex === 0 && dx > 0;
      const atEnd = currentIndex === SECTIONS.length - 1 && dx < 0;
      const clamped = atStart || atEnd ? dx * 0.18 : dx;
      setDragX(clamped);
    }

    function onTouchEnd(e: TouchEvent) {
      if (locked !== "h") return;
      const dx = e.changedTouches[0].clientX - startX;
      locked = null;

      const dir = dx < 0 ? "left" : "right";
      const next = dir === "left" ? currentIndex + 1 : currentIndex - 1;
      const canGo = next >= 0 && next < SECTIONS.length && Math.abs(dx) >= 60;

      if (canGo) {
        // Slide content fully off-screen, then push the new route
        const W = window.innerWidth;
        setSnapping(true);
        setDragX(dx < 0 ? -W : W);
        navTimerRef.current = setTimeout(() => navigate(dir), 230);
      } else {
        // Snap back to centre with spring feel
        setSnapping(true);
        setDragX(0);
        setTimeout(() => setSnapping(false), 320);
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, navigate]);

  return (
    <>
      <TopNav />
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "flex-start",
          overflow: "hidden",
          position: "relative", // creates a clipping context that contains the swipe
        }}
      >
        <DesktopSidebar />
        <div
          ref={wrapRef}
          style={{
            flex: 1,
            minWidth: 0,
            transform: dragX !== 0 ? `translateX(${dragX}px)` : undefined,
            transition: snapping
              ? "transform 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "none",
            willChange: dragX !== 0 ? "transform" : "auto",
          }}
        >
          <main style={{ paddingBottom: "96px" }} className="sm:pb-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
