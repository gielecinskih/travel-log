import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { InsertLocationSchema } from "../schema";

import db from "..";
import { location } from "../schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuwxyz", 5);

export async function findLocationByName(existing: InsertLocationSchema, userId: number) {
  return await db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(slug: string) {
  return !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));
}

export async function findUniqueSlug(slug: string) {
  let existing = await findLocationBySlug(slug);

  while (existing) {
    const idSlug = `${slug}-${nanoid()}`;
    existing = await findLocationBySlug(idSlug);
    if (!existing) {
      return idSlug;
    }
  }

  return slug;
}

export async function insertLocation(insertable: InsertLocationSchema, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();

  return created;
}

export async function findLocations(userId: number) {
  return await db.query.location.findMany({
    where: eq(location.userId, userId),
    orderBy: (location, { asc }) => asc(location.createdAt),
  });
}
