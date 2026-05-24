import AppShell from "@/components/layout/AppShell";
import { SkeletonStyles, Shimmer } from "@/components/layout/Skeleton";

export default function Loading() {
  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0", fontFamily: "Inter, system-ui, sans-serif" }}>
        <SkeletonStyles />

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <Shimmer w="160px" h="24px" radius="8px" />
          <div style={{ marginTop: "8px" }}>
            <Shimmer w="220px" h="13px" radius="5px" />
          </div>
        </div>

        {/* Leaderboard rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <Shimmer w="22px" h="22px" radius="6px" />
              <Shimmer w="36px" h="36px" radius="var(--r-full)" />
              <Shimmer w={`${40 + ((i * 11) % 30)}%`} h="14px" radius="5px" />
              <div style={{ marginLeft: "auto" }}>
                <Shimmer w="32px" h="20px" radius="6px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
