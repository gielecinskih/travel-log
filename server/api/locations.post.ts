import type { DrizzleError } from "drizzle-orm";

import slugify from "slug";

import { findLocationByName, findUniqueSlug, insertLocation } from "~/lib/db/queries/location";
import { insertLocationSchema } from "~/lib/db/schema";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";
import { sendZodError } from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, insertLocationSchema.safeParse);
  if (!result.success) {
    return sendZodError(event, result.error);
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
