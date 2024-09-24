
import envConfig from "@Config/environment";
import { Console } from "@Constants/consoleAttrs";
import { baseAPIRoute } from "@Constants/routeConstants";
import LogAllIncomingRoutes from "@Middleware/logger";
import cors from "cors";
import express, { Express, json } from "express";
import { RateLimitRequestHandler } from "express-rate-limit";
import { HttpLogger } from "pino-http";
import { RouterPaths } from "./router";


class ServerSetupConfig {
  private app: Express;
  private status: Record<string, string | boolean>;
  constructor() {
    this.app = express();
    this.status = {
      serverStarted: "✅",
      elastic: "⏳",
      complete: "⏳",
      removeLines: false,
    };

    // binding methods
    this.writeLines = this.writeLines.bind(this);
    this.finished = this.finished.bind(this);
    this.serverCallBack = this.serverCallBack.bind(this);
    this.checkElasticConnectivity = this.checkElasticConnectivity.bind(this);
  }

  private writeLines(attributes: Record<string, string | boolean>, toggle = false) {
    this.status = { ...this.status, ...attributes };
    if (this.status.removeLines) for (let i = 0; i < 8; i++) process.stdout.write(`${Console.LineUp}`);
    process.stdout.write(Console.Reset);
    process.stdout.write("------------------------------------------------------\n");
    process.stdout.write("------------------------------------------------------\n");
    process.stdout.write(`${Console.fg.Magenta}Host Link: ${envConfig.HOST_URL}:${envConfig.SERVER_PORT}${baseAPIRoute}\n`);
    process.stdout.write(`${Console.fg.Cyan}[Success Status]: Server⚡️       \t\t... ${this.status.serverStarted}\n`);
    process.stdout.write(`${Console.fg.Cyan}[Success Status]: Elastic🗒️      \t\t... ${this.status.elastic}\n`);
    process.stdout.write(`${Console.fg.Cyan}[Success Status]: Application🔥  \t\t... ${this.status.complete}\n${Console.Reset}`);
    process.stdout.write("------------------------------------------------------\n");
    process.stdout.write("------------------------------------------------------\n");
    if (toggle) this.status.removeLines = !this.status.removeLines;
  }

  private finished() {
    if ((this.status.elastic as string).includes("⛔")) {
      this.writeLines({ complete: "⛔" });
      setTimeout(() => process.exit(1), 1000);
    } else {
      this.writeLines({ complete: "✅" });
    }
  }

  private async checkElasticConnectivity() {
    try {
      return true;
    } catch (error) {
      this.writeLines({ elastic: "⛔" });
      throw error;
    }
  }


  private serverCallBack() {
    this.checkElasticConnectivity()
      .then(() => this.writeLines({ elastic: "✅" }))
      .catch((err) => {
        setTimeout(() => console.log('elastic',err,'Error connecting to Elastic'), 1000);
      })
      .finally(() => this.finished());
  }

  loadApp(extraArgs: { rateLimiter: RateLimitRequestHandler; httpLogger: HttpLogger; }) {
    console.log("Starting to load app...");
    this.app.use(extraArgs.httpLogger);
    this.app.use(extraArgs.rateLimiter);
    this.app.use(cors({ credentials: true, origin: "*" }));
    this.app.use(json());
    this.app.use(LogAllIncomingRoutes);

    console.log("Registering routes:");
    RouterPaths.sort((a, b) => a.order - b.order).map(({ route, router }) => this.app.use(route, router));
    this.writeLines({}, true);
    this.app.use("/", (_, res) => res.sendStatus(200));
    this.app.listen(envConfig.SERVER_PORT, () => this.serverCallBack());
  }
}

export default ServerSetupConfig;