import AppShell from "@/components/layout/AppShell";
import { SkeletonStyles, Shimmer } from "@/components/layout/Skeleton";

export default function Loading() {
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ paddingTop: "8px" }}>
          <SkeletonStyles />

          {/* Greeting */}
          <div style={{ padding: "20px 0 16px" }}>
            <Shimmer w="60px" h="13px" radius="6px" />
            <div style={{ marginTop: "6px", marginBottom: "16px" }}>
              <Shimmer w="160px" h="28px" radius="8px" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)",
                    padding: "14px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Shimmer w="40px" h="22px" radius="6px" />
                  <Shimmer w="56px" h="11px" radius="4px" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginBottom: "20px" }}>
            <Shimmer w="100%" h="48px" radius="var(--r-full)" />
          </div>

          {/* Recent sessions */}
          <div style={{ marginBottom: "8px" }}>
            <Shimmer w="80px" h="11px" radius="4px" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {[0, 1, 2].map((i) => (
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
                <Shimmer w="40px" h="40px" />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <Shimmer w="100px" h="14px" radius="5px" />
                  <Shimmer w="140px" h="12px" radius="4px" />
                </div>
                <Shimmer w="24px" h="24px" radius="6px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
