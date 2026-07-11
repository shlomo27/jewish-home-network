import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const createListingSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  listingKind: z.enum(["long_term_rental", "short_term_rental", "sale"]),
  priceAmount: z.number().positive(),
  priceCurrency: z.string().length(3).default("USD"),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  sqft: z.number().int().min(0).optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  region: z.string().optional(),
  country: z.string().min(1),
  postalCode: z.string().optional(),
  propertyType: z.string().min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

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

  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "You must be signed in to create a listing." }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await request.json();
  const parsed = createListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const property = await prisma.property.create({
    data: {
      addressLine1: data.addressLine1,
      city: data.city,
      region: data.region,
      country: data.country,
      postalCode: data.postalCode,
      propertyType: data.propertyType,
      ownerId: userId,
    },
  });

  const listing = await prisma.listing.create({
    data: {
      propertyId: property.id,
      ownerId: userId,
      title: data.title,
      description: data.description,
      listingKind: data.listingKind,
      priceAmount: data.priceAmount,
      priceCurrency: data.priceCurrency,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      sqft: data.sqft,
      photoUrl: data.photoUrl || null,
      status: "live",
    },
    include: { property: true },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
