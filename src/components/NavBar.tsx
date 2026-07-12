"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { initials } from "@/lib/initials";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-amber-100 bg-white/70 backdrop-blur dark:border-amber-950 dark:bg-black/40">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="avatar-badge h-8 w-8 text-sm">KN</span>
          Kehila Network
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Community
          </Link>
          {status === "authenticated" ? (
            <>
              <Link href="/listings/new" className="hover:underline">
                Share a home
              </Link>
              <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <span className="avatar-badge h-7 w-7 text-xs">{initials(session.user?.name)}</span>
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-primary rounded-full px-4 py-1.5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary rounded-full px-4 py-1.5">
                Join the community
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
