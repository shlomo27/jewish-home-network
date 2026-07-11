import Link from "next/link";
import { prisma } from "@/lib/prisma";

const KIND_LABELS: Record<string, string> = {
  long_term_rental: "Long-term rental",
  short_term_rental: "Short-term rental",
  sale: "For sale",
};

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
    include: { property: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Find your next home</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Verified listings, real people, and a clear view of the community around every property.
        </p>
      </div>

      <form className="mb-8 flex gap-2" action="/">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by city, neighborhood, or keyword..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Search
        </button>
      </form>

      {listings.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No listings yet{q ? " for this search" : ""}.{" "}
          <Link href="/listings/new" className="underline">
            Be the first to list a property
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
