import { LoginForm } from "@/components/LoginForm";
import { PasswordLogin } from "@/components/PasswordLogin";

interface LoginPageProps {
  searchParams?: { error?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const authError = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 text-4xl">🧠</div>
          <h1 className="text-2xl font-semibold text-primary">Altoma Founder OS</h1>
          <p className="mt-2 text-sm text-muted">Founder Brain — sign in to continue</p>
        </div>
        {authError && (
          <p className="mb-4 rounded-lg border border-priority-high/30 bg-priority-high/10 px-4 py-3 text-sm text-priority-high">
            {authError}
          </p>
        )}
        <LoginForm />
        <PasswordLogin />
      </div>
    </div>
  );
}
