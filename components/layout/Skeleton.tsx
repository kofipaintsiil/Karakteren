import type { CSSProperties } from "react";

/**
 * Shared skeleton primitives used by route-level `loading.tsx` files.
 * Mirrors the inline `DashboardSkeleton` shimmer pattern so loading
 * states match real page layouts and eliminate the blank-flash on
 * mobile tab navigation.
 */

export function SkeletonStyles() {
  return <style>{`@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>;
}

export function Shimmer({
  w,
  h,
  radius = "var(--r-md)",
  style,
}: {
  w: string;
  h: string;
  radius?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        backgroundColor: "var(--bg-alt)",
        animation: "shimmer 1.4s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

/**
 * Skeleton matching the shared header (title + subtitle) used by
 * the Øving and Eksamen pages.
 */
export function HeaderSkeleton() {
  return (
    <div style={{ padding: "20px 0 14px" }}>
      <Shimmer w="120px" h="26px" radius="8px" />
      <div style={{ marginTop: "8px" }}>
        <Shimmer w="220px" h="13px" radius="5px" />
      </div>
    </div>
  );
}

/** Skeleton for the rounded search input on Øving and Eksamen. */
export function SearchBarSkeleton() {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Shimmer w="100%" h="44px" radius="var(--r-full)" />
    </div>
  );
}

/** A card containing a list of subject rows (icon + label). */
export function SubjectListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            minHeight: "56px",
            padding: "12px 16px",
            borderTop: idx > 0 ? "1px solid var(--border)" : "none",
          }}
        >
          <Shimmer w="36px" h="36px" radius="10px" />
          <Shimmer w={`${45 + ((idx * 13) % 35)}%`} h="15px" radius="5px" />
        </div>
      ))}
    </div>
  );
}
