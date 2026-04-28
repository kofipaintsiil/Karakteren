"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Button from "@/components/ui/Button";
import Blobb from "@/components/Blobb";

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Feil e-post eller passord.",
  "Email not confirmed": "E-posten er ikke bekreftet. Sjekk innboksen din.",
  "User already registered": "Denne e-posten er allerede registrert. Logg inn i stedet.",
  "Password should be at least 6 characters": "Passordet må være minst 6 tegn.",
  "Unable to validate email address: invalid format": "Ugyldig e-postadresse.",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const isSignup = params.get("signup") === "1";
  const next = params.get("next") ?? "/dashboard";
  const hasError = params.get("error") === "auth";

  const [mode, setMode] = useState<"login" | "signup" | "forgot">(isSignup ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    hasError ? { type: "error", text: "Pålogging feilet. Prøv igjen." } : null
  );

  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  async function handleGoogle() {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      setLoading(false);
      if (error) setMessage({ type: "error", text: ERROR_MESSAGES[error.message] ?? error.message });
      else setMessage({ type: "success", text: "Tilbakestillingslenke sendt. Sjekk e-posten din." });
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) setMessage({ type: "error", text: ERROR_MESSAGES[error.message] ?? error.message });
      else {
        setMessage({ type: "success", text: "Konto opprettet! Du må bekrefte e-posten din før du kan logge inn — sjekk innboksen (og søppelpost)." });
        setMode("login");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: ERROR_MESSAGES[error.message] ?? error.message });
    } else {
      // Full reload so the server-side middleware reads the new session cookie
      window.location.href = next;
    }
  }

  const titles = { login: "Logg inn", signup: "Opprett konto", forgot: "Glemt passord" };

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>

        {/* Logo + Blobb */}
        <div className="text-center mb-8">
          <Blobb state="idle" size={80} />
          <h1 style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--text)", marginTop: "12px" }}>
            Karakteren
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 600, marginTop: "4px" }}>
            Øv til muntlig eksamen
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "var(--surface)",
          border: "2px solid var(--border)",
          borderBottom: "4px solid var(--border-dark)",
          borderRadius: "var(--r-xl)",
          padding: "24px",
        }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "20px", color: "var(--text)" }}>
            {titles[mode]}
          </h2>

          {/* Error/success message */}
          {message && (
            <div style={{
              backgroundColor: message.type === "error" ? "oklch(0.96 0.04 22)" : "var(--green-soft)",
              border: `2px solid ${message.type === "error" ? "var(--error)" : "var(--green)"}`,
              borderRadius: "var(--r-md)",
              padding: "10px 14px",
              fontSize: "13px",
              fontWeight: 700,
              color: message.type === "error" ? "var(--error)" : "var(--green-press)",
              marginBottom: "16px",
            }}>
              {message.text}
            </div>
          )}

          {/* Google button — only on login/signup */}
          {mode !== "forgot" && (
            <>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleGoogle}
                disabled={loading}
                style={{ marginBottom: "16px", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Fortsett med Google
              </Button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "2px", backgroundColor: "var(--border)" }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-faint)" }}>eller</span>
                <div style={{ flex: 1, height: "2px", backgroundColor: "var(--border)" }} />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", display: "block", marginBottom: "6px" }}>
                E-post
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="deg@skole.no"
                style={{
                  width: "100%", height: "48px", padding: "0 14px",
                  backgroundColor: "var(--bg)",
                  border: "2px solid var(--border)",
                  borderRadius: "var(--r-md)",
                  fontSize: "14px", fontWeight: 500,
                  color: "var(--text)", fontFamily: "inherit", outline: "none",
                }}
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", display: "block", marginBottom: "6px" }}>
                  Passord
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%", height: "48px", padding: "0 14px",
                    backgroundColor: "var(--bg)",
                    border: "2px solid var(--border)",
                    borderRadius: "var(--r-md)",
                    fontSize: "14px", fontWeight: 500,
                    color: "var(--text)", fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            )}

            <Button size="md" fullWidth disabled={loading} style={{ marginTop: "4px" }}>
              {loading ? "Laster..." : titles[mode]}
            </Button>
          </form>

          {/* Footer links */}
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px", textAlign: "center" }}>
            {mode === "login" && (
              <>
                <button type="button" onClick={() => { setMode("forgot"); setMessage(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", fontFamily: "inherit", padding: "8px 0", minHeight: "44px" }}>
                  Glemt passord?
                </button>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
                  Ingen konto?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setMessage(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--coral)", fontWeight: 800, fontFamily: "inherit", fontSize: "13px", padding: "8px 4px", minHeight: "44px" }}>
                    Registrer deg
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
                Har du konto?{" "}
                <button type="button" onClick={() => { setMode("login"); setMessage(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--coral)", fontWeight: 800, fontFamily: "inherit", fontSize: "13px", padding: "8px 4px", minHeight: "44px" }}>
                  Logg inn
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => { setMode("login"); setMessage(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", fontFamily: "inherit", padding: "8px 0", minHeight: "44px" }}>
                ← Tilbake til innlogging
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
