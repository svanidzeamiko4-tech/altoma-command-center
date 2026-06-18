"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/os", label: "Home", icon: "⌂" },
  { href: "/os/inbox", label: "Inbox", icon: "📥" },
  { href: "/os/new", label: "New", icon: "+" },
  { href: "/os/vault", label: "Vault", icon: "🔒" },
  { href: "/os/journal", label: "Journal", icon: "📓" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/os"
              ? pathname === "/os"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-tap min-w-tap flex-col items-center justify-center gap-0.5 rounded-lg px-3 text-xs transition-colors ${
                active ? "text-accent" : "text-muted hover:text-primary"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
