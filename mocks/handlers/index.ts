import { http, HttpResponse } from "msw";

/** MSW handlers mirror real `app/api/*` contracts. */
export const handlers = [
  http.get("/api/health", () => {
    return HttpResponse.json({
      data: {
        status: "ok",
        source: "msw",
      },
    });
  }),
];
