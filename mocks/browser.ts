import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** Browser MSW worker for local development without live Neon/Paystack/SMTP. */
export const worker = setupWorker(...handlers);
