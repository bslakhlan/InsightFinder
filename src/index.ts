import environment from "@Config/environment";
import rateLimit from "express-rate-limit";
import ServerSetupConfig from "./server";
import PinoLogger from '@Utilities/pinoLogger';

console.log("Starting application...");

const App: ServerSetupConfig = new ServerSetupConfig();
const Logger = new PinoLogger(['llm', 'centralService', 'elastic', 'SQS', 'api','firecrawl']);

console.log("Initializing app...");
App.loadApp({
  rateLimiter: rateLimit({
    windowMs: environment.RATE_LIMIT_WINDOW,
    limit: environment.RATE_LIMIT_USERS,
  }),
  httpLogger: Logger.getHttpLogger()
});

console.log("App initialization complete.");

export {Logger as Log};