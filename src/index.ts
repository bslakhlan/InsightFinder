import environment from "@Config/environment";
import rateLimit from "express-rate-limit";
import ServerSetupConfig from "./server";
import PinoLogger from '@Utilities/pinoLogger';

const App: ServerSetupConfig = new ServerSetupConfig();
const Logger = new PinoLogger(['llm', 'scout', 'api','prompts']);

App.loadApp({
  rateLimiter: rateLimit({
    windowMs: environment.RATE_LIMIT_WINDOW,
    limit: environment.RATE_LIMIT_USERS,
  }),
  httpLogger: Logger.getHttpLogger()
});

export {Logger as Log};