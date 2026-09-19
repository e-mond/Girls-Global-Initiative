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
  http.get("/api/admin/content/:entity", () => {
    return HttpResponse.json({
      data: { items: [] },
    });
  }),
  http.get("/api/admin/media", () => {
    return HttpResponse.json({
      data: { items: [] },
    });
  }),
];
