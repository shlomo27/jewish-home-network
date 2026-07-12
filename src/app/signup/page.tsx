"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { COUNTRIES } from "@/lib/countries";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("seeker");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, country: country || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.formErrors?.[0] ?? data.error ?? "Registration failed.");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.error) {
        setError("Account created, but sign-in failed. Please log in.");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Join the community</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Tell us a bit about yourself so the community knows who you are.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="input">
            <option value="">Select a country...</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">I am a...</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
            <option value="seeker">Home seeker</option>
            <option value="owner">Property owner / landlord</option>
            <option value="agent">Agency / broker</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
