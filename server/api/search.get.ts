import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";
import { sendZodError } from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
        headers: {
          "User-Agent": "nuxt-travel-log | gielaktv@gmail.com",
        },
        signal: AbortSignal.timeout(5000), // 5 seconds timeout
      });

      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: "Unable to reach search API.",
        }));
      }

      return await response.json() as NominatimResult[];
    }
    catch {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: "Unable to reach search API.",
      }));
    }
  }, { maxAge: 60 * 60 * 24, name: "search-nominatim", getKey: (event) => {
    const query = getQuery(event);
    return query.q?.toString() || "";
  } }),
);
