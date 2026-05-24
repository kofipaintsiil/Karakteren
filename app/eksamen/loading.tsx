import AppShell from "@/components/layout/AppShell";
import {
  SkeletonStyles,
  Shimmer,
  SearchBarSkeleton,
  SubjectListSkeleton,
} from "@/components/layout/Skeleton";

export default function Loading() {
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
        <SkeletonStyles />

        {/* Header: title + subtitle on the left, Blobb avatar on the right */}
        <div style={{ padding: "16px 0 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <Shimmer w="120px" h="22px" radius="8px" />
            <div style={{ marginTop: "8px" }}>
              <Shimmer w="240px" h="13px" radius="5px" />
            </div>
          </div>
          <Shimmer w="44px" h="44px" radius="var(--r-full)" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "32px" }}>
          {/* Exam date card */}
          <Shimmer w="100%" h="92px" radius="var(--r-lg)" />

          {/* Subject picker label + search */}
          <div style={{ marginBottom: "4px" }}>
            <Shimmer w="80px" h="13px" radius="5px" />
          </div>
          <SearchBarSkeleton />
          <SubjectListSkeleton rows={5} />
        </div>
      </div>
    </AppShell>
  );
}
