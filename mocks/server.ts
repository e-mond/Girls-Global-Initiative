import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Node MSW server for Playwright and Cypress test runs. */
export const server = setupServer(...handlers);
