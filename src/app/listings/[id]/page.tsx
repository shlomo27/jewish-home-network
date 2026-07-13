import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/initials";

const KIND_LABELS: Record<string, string> = {
  long_term_rental: "Long-term rental",
  short_term_rental: "Short-term rental",
  sale: "For sale",
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { property: true, owner: { select: { name: true } } },
  });

  if (!listing) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        {listing.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.photoUrl} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No photo yet
          </div>
        )}
      </div>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {KIND_LABELS[listing.listingKind] ?? listing.listingKind}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{listing.title}</h1>
      <p className="mt-1 text-zinc-500">
        {listing.property.addressLine1}, {listing.property.city}, {listing.property.country}
      </p>
      <p className="mt-4 text-2xl font-semibold">
        {formatPrice(Number(listing.priceAmount), listing.priceCurrency)}
        {listing.listingKind !== "sale" && <span className="text-sm font-normal text-zinc-500">/mo</span>}
      </p>

      <div className="mt-6 flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
        {listing.bedrooms != null && <span>{listing.bedrooms} bd</span>}
        {listing.bathrooms != null && <span>{listing.bathrooms} ba</span>}
        {listing.sqft != null && <span>{listing.sqft} sqft</span>}
      </div>

      {(listing.property.shabbatElevator || listing.property.withinEruv || listing.property.kosherKitchen) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {listing.property.shabbatElevator && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Shabbat elevator
            </span>
          )}
          {listing.property.withinEruv && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Within an eruv
            </span>
          )}
          {listing.property.kosherKitchen && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              Kosher-certified kitchen
            </span>
          )}
        </div>
      )}

      <p className="mt-6 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {listing.description}
      </p>

      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-100 p-4 text-sm dark:border-amber-950">
        <span className="avatar-badge h-9 w-9 text-sm">{initials(listing.owner.name)}</span>
        <div>
          <p className="font-medium">Shared by {listing.owner.name}</p>
          <p className="mt-1 text-zinc-500">
            Community Score, Trust Score, and in-platform messaging land in a later iteration — see the
            product blueprint in <code>docs/PRODUCT_BLUEPRINT.md</code>.
          </p>
        </div>
      </div>
    </main>
  );
}
