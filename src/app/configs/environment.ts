
    import * as assert from "assert";
    import { Console } from '@Constants/consoleAttrs';
    import chalk from "chalk";
    import "dotenv/config";

    class EnvConfig {
    public APP_VERSION: string;
    public NODE_ENV: string;
    public SERVER_PORT: number;
    public HOST_URL: string;
    public RATE_LIMIT_USERS: number;
    public RATE_LIMIT_WINDOW: number;
    public X_TYPE_DATABASE_URL: string;
    public LOG_LEVEL: string;
    public OPENAI_API_KEY: string;
    public CLAUDE_API_KEY: string; 

    constructor() {
        // Assertion for required properties
        assert.ok(
        process.env.X_TYPE_DATABASE_URL,
        `\n${chalk.bgRed.bold(" Env Error ")} : ${chalk.redBright(`${chalk.bold("`X_TYPE_DATABASE_URL`")} must be defined`)}`
        );
        assert.ok(process.env.OPENAI_API_KEY, `\n${Console.bg.Red}Env Error${Console.Reset} : OPENAI_API_KEY must be defined`);
        assert.ok(process.env.CLAUDE_API_KEY, `\n${Console.bg.Red}Env Error${Console.Reset} : CLAUDE_API_KEY must be defined`);
        

        this.APP_VERSION = (process.env.npm_package_version as string) ?? "1.0.0";
        this.NODE_ENV = (process.env.NODE_ENV as string) ?? "DEV";
        this.SERVER_PORT = parseInt(process.env.SERVER_PORT ?? "5000");
        this.HOST_URL = process.env.HOST_URL ?? "http://localhost";
        this.RATE_LIMIT_USERS = parseInt(process.env.RATE_LIMIT_USERS ?? "30");
        this.RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW ?? "60000");
        this.X_TYPE_DATABASE_URL = process.env.DATABASE_URL as string;
        this.LOG_LEVEL = process.env.LOG_LEVEL || (this.NODE_ENV === "DEV" ? "debug" : "info");

        if (!process.env.NODE_ENV)
        process.stdout.write(
            `\n${chalk.black.bgYellow.bold(" Env Warn ")} ${chalk.yellow("`NODE_ENV` not specified, defaulting to DEV")}`
        );

        if (!process.env.LOG_LEVEL)
        process.stdout.write(
            `\n${chalk.black.bgYellow.bold(" Env Warn ")} ${chalk.yellow("`LOG_LEVEL` not specified, defaulting to debug for DEV or info for PROD")}`
        );

        this.OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
        this.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY as string;
        process.stdout.write("\n");

        process.stdout.write(`\n${chalk.blue.bold("Version \t")} ${chalk.blueBright(`... ${this.APP_VERSION}`)}`);
        process.stdout.write(`\n${chalk.blue.bold("Environment\t")} ${chalk.blueBright(`... ${this.NODE_ENV}`)}`);
        process.stdout.write(`\n${chalk.blue.bold("Log Level\t")} ${chalk.blueBright(`... ${this.LOG_LEVEL}`)}`);

        process.stdout.write("\n");
    }
    }

    export default new EnvConfig();
    
