import AppShell from "@/components/layout/AppShell";
import { SkeletonStyles, Shimmer } from "@/components/layout/Skeleton";

export default function Loading() {
  return (
    <AppShell>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 0", fontFamily: "Inter, system-ui, sans-serif" }}>
        <SkeletonStyles />

        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <Shimmer w="120px" h="24px" radius="8px" />
          <div style={{ marginTop: "8px" }}>
            <Shimmer w="200px" h="13px" radius="5px" />
          </div>
        </div>

        {/* Profile card */}
        <div
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <Shimmer w="56px" h="56px" radius="var(--r-full)" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <Shimmer w="140px" h="16px" radius="5px" />
            <Shimmer w="180px" h="13px" radius="4px" />
          </div>
        </div>

        {/* Settings list rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <Shimmer w="20px" h="20px" radius="6px" />
              <Shimmer w={`${40 + ((i * 9) % 25)}%`} h="14px" radius="5px" />
              <div style={{ marginLeft: "auto" }}>
                <Shimmer w="16px" h="16px" radius="4px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
