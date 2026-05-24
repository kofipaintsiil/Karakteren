import AppShell from "@/components/layout/AppShell";
import {
  SkeletonStyles,
  HeaderSkeleton,
  SearchBarSkeleton,
  SubjectListSkeleton,
} from "@/components/layout/Skeleton";

export default function Loading() {
  return (
    <AppShell>
      <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" }}>
        <SkeletonStyles />
        <HeaderSkeleton />
        <SearchBarSkeleton />
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "40px" }}>
          <SubjectListSkeleton rows={6} />
          <SubjectListSkeleton rows={5} />
        </div>
      </div>
    </AppShell>
  );
}
