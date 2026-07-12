import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/initials";

const KIND_LABELS: Record<string, string> = {
  long_term_rental: "Long-term rental",
  short_term_rental: "Short-term rental",
  sale: "For sale",
};

const TRUST_PILLARS = [
  {
    title: "Real, verified people",
    body: "Every host and seeker builds a profile — no anonymous listings, no guessing who you're talking to.",
  },
  {
    title: "Know the neighborhood",
    body: "See what's actually nearby — synagogues, kosher shops, schools, parks — before you ever reach out.",
  },
  {
    title: "Talk directly, safely",
    body: "Message hosts right on the platform. No middlemen, no pressure, no surprises.",
  },
];

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const listings = await prisma.listing.findMany({
    where: {
      status: "live",
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { property: { city: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { property: true, owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight">
          A community you can trust, wherever you land
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Kehila Network connects people finding a home with real, verified hosts across the community —
          not a cold listings catalog.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TRUST_PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-2xl border border-amber-100 bg-white/60 p-4 dark:border-amber-950 dark:bg-white/5"
          >
            <p className="font-medium">{pillar.title}</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{pillar.body}</p>
          </div>
        ))}
      </div>

      <form className="mb-8 flex gap-2" action="/">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by city, neighborhood, or keyword..."
          className="input"
        />
        <button type="submit" className="btn-primary rounded-lg px-5 py-2 text-sm font-medium">
          Search
        </button>
      </form>

      {listings.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No homes shared yet{q ? " for this search" : ""}.{" "}
          <Link href="/listings/new" className="underline">
            Be the first to share one with the community
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group overflow-hidden rounded-2xl border border-amber-100 bg-white transition hover:shadow-md dark:border-amber-950 dark:bg-zinc-900"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {listing.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.photoUrl}
                    alt={listing.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                    No photo yet
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {KIND_LABELS[listing.listingKind] ?? listing.listingKind}
                </p>
                <h2 className="mt-1 truncate font-medium">{listing.title}</h2>
                <p className="text-sm text-zinc-500">
                  {listing.property.city}, {listing.property.country}
                </p>
                <p className="mt-2 font-semibold">
                  {formatPrice(Number(listing.priceAmount), listing.priceCurrency)}
                  {listing.listingKind !== "sale" && (
                    <span className="text-xs font-normal text-zinc-500">/mo</span>
                  )}
                </p>
                <div className="mt-3 flex items-center gap-2 border-t border-zinc-100 pt-3 text-sm text-zinc-500 dark:border-zinc-800">
                  <span className="avatar-badge h-6 w-6 text-[10px]">{initials(listing.owner.name)}</span>
                  {listing.owner.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
