import { createClient } from "./supabase/server";

interface SessionRow {
  id: string;
  subject: string;
  topic: string;
  grade: number | null;
  feedback: string | null;
  created_at: string;
}

export async function fetchSessions(userId: string): Promise<SessionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, subject, topic, grade, feedback, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [] as SessionRow[];
  return (data ?? []) as SessionRow[];
}

export async function fetchSession(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, subject, topic, grade, feedback, transcript, created_at")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as {
    id: string;
    subject: string;
    topic: string;
    grade: number | null;
    feedback: string | null;
    transcript: { role: string; text: string }[] | null;
    created_at: string;
  };
}

interface StatsRow { subject: string; topic: string; grade: number | null; created_at: string; }

export async function fetchStats(userId: string) {
  const supabase = await createClient();
  const { data: rawData, error } = await supabase
    .from("sessions")
    .select("subject, topic, grade, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !rawData || rawData.length === 0) return null;
  const data = rawData as StatsRow[];

  const grades = data.map((s) => s.grade).filter((g) => g !== null) as number[];
  if (grades.length === 0) return null;

  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;

  const bySubject: Record<string, number[]> = {};
  data.forEach((s) => {
    if (s.grade) {
      if (!bySubject[s.subject]) bySubject[s.subject] = [];
      bySubject[s.subject].push(s.grade);
    }
  });

  const subjectAvgs = Object.entries(bySubject).map(([subject, gs]) => ({
    subject,
    avg: Math.round((gs.reduce((a, b) => a + b, 0) / gs.length) * 10) / 10,
    count: gs.length,
  }));

  const sorted = [...subjectAvgs].sort((a, b) => b.avg - a.avg);
  const bestSubject = sorted[0]?.subject ?? "—";
  const worstSubject = sorted[sorted.length - 1]?.subject ?? "—";

  const chartData = data.slice(-10).map((s, i) => ({
    nr: i + 1,
    karakter: s.grade as number,
    fag: s.subject,
  }));

  return {
    total: data.length,
    avg: Math.round(avg * 10) / 10,
    bestSubject,
    worstSubject,
    subjectAvgs,
    chartData,
    streak: computeStreak(data.map((s) => s.created_at)),
  };
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const days = [...new Set(dates.map((d) => d.slice(0, 10)))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);
  if (days[0] !== today && days[0] !== getPrevDay(today)) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] === getPrevDay(days[i - 1])) streak++;
    else break;
  }
  return streak;
}

function getPrevDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_sessions: number;
  avg_grade: number;
  top_subject: string;
  avatar_url: string | null;
}

export async function fetchLeaderboard(subject?: string): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();

  const { data: rawData, error } = await supabase
    .from("sessions")
    .select("user_id, subject, grade");

  if (error || !rawData) return [];

  type Row = { user_id: string; subject: string; grade: number | null };
  const rows = rawData as Row[];

  const filtered = subject ? rows.filter((r) => r.subject === subject) : rows;

  const byUser: Record<string, { grades: number[]; subjects: string[] }> = {};
  filtered.forEach((r) => {
    if (!byUser[r.user_id]) byUser[r.user_id] = { grades: [], subjects: [] };
    if (r.grade !== null) byUser[r.user_id].grades.push(r.grade);
    byUser[r.user_id].subjects.push(r.subject);
  });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, show_on_leaderboard, avatar_url");

  type Profile = { id: string; display_name: string | null; show_on_leaderboard: boolean | null; avatar_url: string | null };
  const profileMap: Record<string, Profile> = {};
  (profiles as Profile[] ?? []).forEach((p) => { profileMap[p.id] = p; });

  const entries: LeaderboardEntry[] = Object.entries(byUser)
    .filter(([uid]) => profileMap[uid]?.show_on_leaderboard !== false)
    .map(([uid, { grades, subjects }]) => {
      const avg = grades.length > 0
        ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10
        : 0;
      const subjectCount: Record<string, number> = {};
      subjects.forEach((s) => { subjectCount[s] = (subjectCount[s] ?? 0) + 1; });
      const top_subject = Object.entries(subjectCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
      const display_name = profileMap[uid]?.display_name ?? "Anonym";
      const avatar_url = profileMap[uid]?.avatar_url ?? null;
      return { user_id: uid, display_name, total_sessions: grades.length, avg_grade: avg, top_subject, avatar_url };
    })
    .sort((a, b) => b.avg_grade - a.avg_grade || b.total_sessions - a.total_sessions)
    .slice(0, 50);

  return entries;
}

export async function fetchProfile(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, show_on_leaderboard, avatar_url, exam_date")
    .eq("id", userId)
    .single();
  return data as { display_name: string | null; show_on_leaderboard: boolean | null; avatar_url: string | null; exam_date: string | null } | null;
}
