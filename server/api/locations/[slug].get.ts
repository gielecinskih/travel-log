import { findLocation } from "~/lib/db/queries/location";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;

  const location = await findLocation(event.context.user.id, slug);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    }));
  }

  return location;
});
