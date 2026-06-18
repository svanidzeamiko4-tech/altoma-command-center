import Link from "next/link";
import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import LogoutButton from "./LogoutButton";

interface OsLayoutProps {
  children: ReactNode;
  title?: string;
  headerRight?: ReactNode;
  icon?: ReactNode;
  showFab?: boolean;
}

export function OsLayout({
  children,
  title,
  headerRight,
  icon,
  showFab = false,
}: OsLayoutProps) {
  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-8">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            {icon}
            {title && (
              <h1 className="text-lg font-semibold text-primary">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">{headerRight}</div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-6">{children}</main>

      {showFab && (
        <Link
          href="/os/new"
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl font-light text-bg shadow-lg transition-transform hover:scale-105 md:bottom-8"
          aria-label="New note"
        >
          +
        </Link>
      )}

      <BottomNav />

      <nav className="pointer-events-none fixed left-4 top-20 z-30 hidden w-max flex-col gap-2 md:flex">
        <Link href="/os" className="btn-ghost pointer-events-auto text-sm">
          Dashboard
        </Link>
        <Link href="/os/inbox" className="btn-ghost pointer-events-auto text-sm">
          Inbox
        </Link>
        <Link href="/os/vault" className="btn-ghost pointer-events-auto text-sm">
          Vault
        </Link>
        <Link href="/os/journal" className="btn-ghost pointer-events-auto text-sm">
          Journal
        </Link>
        <LogoutButton />
      </nav>
    </div>
  );
}
