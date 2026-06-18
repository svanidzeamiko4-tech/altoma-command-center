"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DevPasswordLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/os");
    router.refresh();
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
        Dev password login
      </p>
      <p className="mb-4 text-xs text-muted">
        Local development only. Set a password in Supabase Dashboard →
        Authentication → Users.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Founder email"
          className="input"
          autoComplete="email"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="input"
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-secondary w-full text-sm"
        >
          {loading ? "Signing in…" : "Sign in with password"}
        </button>
        {error && (
          <p className="text-sm text-priority-high">{error}</p>
        )}
      </form>
    </div>
  );
}
