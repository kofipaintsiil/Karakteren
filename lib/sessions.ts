import { createBrowserClient } from "@supabase/ssr";

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface SaveSessionParams {
  subject: string;
  topic: string;
  grade: number;
  feedback: string;
  messages: { role: "examiner" | "student"; text: string }[];
}

export async function saveSession(params: SaveSessionParams): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      subject: params.subject,
      topic: params.topic,
      grade: params.grade,
      feedback: params.feedback,
      transcript: params.messages,
    })
    .select("id")
    .single();

  if (error || !data) return null;
  return data.id;
}

export async function fetchSessions() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, subject, topic, grade, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return [];
  return data ?? [];
}

export async function fetchStats() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("subject, topic, grade, created_at")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return null;

  const grades = data.map((s) => s.grade).filter((g) => g !== null) as number[];
  const avg = grades.reduce((a, b) => a + b, 0) / grades.length;

  // Best subject
  const bySubject: Record<string, number[]> = {};
  data.forEach((s) => {
    if (s.grade) {
      if (!bySubject[s.subject]) bySubject[s.subject] = [];
      bySubject[s.subject].push(s.grade);
    }
  });
  const subjectAvgs = Object.entries(bySubject).map(([subject, gs]) => ({
    subject,
    avg: gs.reduce((a, b) => a + b, 0) / gs.length,
    count: gs.length,
  }));
  const bestSubject = subjectAvgs.sort((a, b) => b.avg - a.avg)[0];
  const worstSubject = subjectAvgs.sort((a, b) => a.avg - b.avg)[0];

  // Chart data — last 10 sessions
  const chartData = data.slice(-10).map((s, i) => ({
    nr: i + 1,
    karakter: s.grade,
    fag: s.subject,
  }));

  return {
    total: data.length,
    avg: Math.round(avg * 10) / 10,
    bestSubject: bestSubject?.subject ?? "—",
    worstSubject: worstSubject?.subject ?? "—",
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
