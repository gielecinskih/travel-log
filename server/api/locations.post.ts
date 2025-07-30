import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { insertLocationSchema } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const result = await readValidatedBody(event, insertLocationSchema.safeParse);
  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "Location with this name already exists.",
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    const created = insertLocation(result.data, slug, event.context.user.id);
    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    const cause = error.cause as { message: string };
    if (cause.message === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug") {
      return sendError(event, createError({
        statusCode: 422,
        statusMessage: "Slug must be unique.",
      }));
    }
    throw error;
  }
});
