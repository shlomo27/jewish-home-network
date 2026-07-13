"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewListingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      listingKind: form.get("listingKind"),
      priceAmount: Number(form.get("priceAmount")),
      priceCurrency: form.get("priceCurrency") || "USD",
      bedrooms: form.get("bedrooms") ? Number(form.get("bedrooms")) : undefined,
      bathrooms: form.get("bathrooms") ? Number(form.get("bathrooms")) : undefined,
      sqft: form.get("sqft") ? Number(form.get("sqft")) : undefined,
      photoUrl: form.get("photoUrl") || undefined,
      addressLine1: form.get("addressLine1"),
      city: form.get("city"),
      region: form.get("region") || undefined,
      country: form.get("country"),
      postalCode: form.get("postalCode") || undefined,
      propertyType: form.get("propertyType"),
      shabbatElevator: form.get("shabbatElevator") === "on",
      withinEruv: form.get("withinEruv") === "on",
      kosherKitchen: form.get("kosherKitchen") === "on",
    };

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.formErrors?.[0] ?? data.error ?? "Could not create listing.");
      setLoading(false);
      return;
    }

    const { listing } = await res.json();
    router.push(`/listings/${listing.id}`);
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="text-xl font-semibold tracking-tight">Share a home with the community</h1>
      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <input name="title" required className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea name="description" required rows={4} className="input" />
        </div>

        <div>
          <label className="text-sm font-medium">Listing type</label>
          <select name="listingKind" required className="input">
            <option value="long_term_rental">Long-term rental</option>
            <option value="short_term_rental">Short-term rental</option>
            <option value="sale">For sale</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Property type</label>
          <input name="propertyType" required placeholder="Apartment, house, condo..." className="input" />
        </div>

        <div>
          <label className="text-sm font-medium">Price</label>
          <input name="priceAmount" type="number" min="0" step="1" required className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Currency</label>
          <input name="priceCurrency" defaultValue="USD" maxLength={3} className="input" />
        </div>

        <div>
          <label className="text-sm font-medium">Bedrooms</label>
          <input name="bedrooms" type="number" min="0" className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Bathrooms</label>
          <input name="bathrooms" type="number" min="0" className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Square footage</label>
          <input name="sqft" type="number" min="0" className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Photo URL</label>
          <input name="photoUrl" type="url" placeholder="https://..." className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Address</label>
          <input name="addressLine1" required className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">City</label>
          <input name="city" required className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Region / state</label>
          <input name="region" className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Country</label>
          <input name="country" required className="input" />
        </div>
        <div>
          <label className="text-sm font-medium">Postal code</label>
          <input name="postalCode" className="input" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Practical &amp; accessibility info</label>
          <p className="mt-1 text-xs text-zinc-500">
            Helpful details about the property itself — check anything that applies.
          </p>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="shabbatElevator" />
              Shabbat elevator
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="withinEruv" />
              Within an eruv boundary
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="kosherKitchen" />
              Kosher-certified kitchen
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 sm:col-span-2"
        >
          {loading ? "Sharing..." : "Share with the community"}
        </button>
      </form>
    </main>
  );
}
