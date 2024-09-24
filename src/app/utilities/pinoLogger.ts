import environment from "@Config/environment";
import fs from "fs";
import path from "path";
import pino, { Logger } from "pino";
import pinoHttp from "pino-http";

class PinoLogger {
  private baseLogDir: string;
  private channels: string[];
  private logLevel: string;
  private loggers: { [key: string]: Logger } = {};
  private defaultChannel: string;

  constructor(channels: string[] = ["http", "app","LLM"], defaultChannel: string = "app") {
    this.baseLogDir = path.resolve(process.cwd(), "storage", "logs");
    this.channels = [...channels, "http", "app"];
    this.logLevel = environment.LOG_LEVEL || "debug";
    this.defaultChannel = this.channels.includes(defaultChannel) ? defaultChannel : "app";

    this.setupLogDirectory();
    this.setupLoggers();
  }

//   public createChildLogger(context: Record<string, any>, channel: string = this.defaultChannel): Logger {
//     const parentLogger = this.getLoggerWithRequestIdAndUrl(channel);
//     return parentLogger.child(context);
//   }
  
  public getHttpLogger() {
    return pinoHttp({ logger: this.loggers["http"] });
  }

  private setupLogDirectory() {
    if (!fs.existsSync(this.baseLogDir)) {
      fs.mkdirSync(this.baseLogDir, { recursive: true });
    }
  }

  private setupLoggers() {
    this.channels.forEach((channel) => {
      const logFilePath = path.join(this.baseLogDir, `${channel}.log`);
      this.loggers[channel] = pino({
        level: this.logLevel,
        transport: {
          targets: [
            {
              target: "pino-pretty",
              options: { destination: logFilePath, translateTime: true, colorize: false },
            },
          ],
        },
      });
    });
  }
  
  private getLogger(channel: string = this.defaultChannel): Logger {
    return this.loggers[channel] || this.loggers[this.defaultChannel];
  }
  
//   private getLoggerWithRequestIdAndUrl(channel: string = this.defaultChannel): Logger {
//     const baseLogger = this.getLogger(channel);
//     const request_id = getRequestId();
//     const url = getUrl();
//     return baseLogger.child({ request_id, url });
//   }
  
  private log(level: keyof Logger, args: any[], channel?: string) {
    (this.getLogger(channel)[level] as Function)(...args);
  }

  trace(...args: any[]) {
    this.log("trace", args);
  }

  debug(...args: any[]) {
    this.log("debug", args);
  }

  info(...args: any[]) {
    this.log("info", args);
  }

  warn(...args: any[]) {
    this.log("warn", args);
  }

  error(...args: any[]) {
    this.log("error", args);
  }

  fatal(...args: any[]) {
    this.log("fatal", args);
  }

  // Methods with optional channel
  traceWithChannel(channel: string, ...args: any[]) {
    this.log("trace", args, channel);
  }

  debugWithChannel(channel: string, ...args: any[]) {
    this.log("debug", args, channel);
  }

  infoWithChannel(channel: string, ...args: any[]) {
    this.log("info", args, channel);
  }

  warnWithChannel(channel: string, ...args: any[]) {
    this.log("warn", args, channel);
  }

  errorWithChannel(channel: string, ...args: any[]) {
    this.log("error", args, channel);
  }

  fatalWithChannel(channel: string, ...args: any[]) {
    this.log("fatal", args, channel);
  }
}

export default PinoLogger;