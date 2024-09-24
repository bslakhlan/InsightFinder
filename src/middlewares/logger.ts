import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

const formatTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
};

const LogAllIncomingRoutes = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Accessing route: ${req.method} ${req.path}`);
  const start = new Date().getTime();
  console.log(
    chalk.bold(
      chalk.bgBlue(' REQUEST  '),
      chalk.gray(`[${formatTime()}] ::`),
      chalk.bgYellow(` ${req.protocol.toUpperCase()} ${req.method} `),
      chalk.blueBright(req.path)
    )
  );

  res.on('finish', () => {
    const duration = new Date().getTime() - start;
    const endStr =
      chalk.gray(req.originalUrl) +
      ' - ' +
      chalk.cyanBright(`Returned: ${duration}ms |`) +
      chalk.blueBright(` Status: ${res.statusCode}`);
    const startStr = chalk.bgMagenta(' RESPONSE ') + chalk.gray(` [${formatTime()}] ::`);

    switch (res.statusCode) {
      case 200:
      case 201:
      case 204:
      case 304:
        console.debug(chalk.bold(startStr, chalk.bgCyan(' ✔ SUCCESS '), endStr));
        break;
      case 400:
        console.error(chalk.bold(startStr, chalk.bgYellow(' ⚠ INVALID '), endStr));
        break;
      case 401:
        console.error(chalk.bold(startStr, chalk.bgRed(' ❗ UNAUTHORIZED '), endStr));
        break;
      case 403:
        console.error(chalk.bold(startStr, chalk.bgRed(' 🚫 FORBIDDEN '), endStr));
        break;
      case 404:
        console.error(chalk.bold(startStr, chalk.bgMagenta.white(' 💀 NOT FOUND '), endStr));
        break;
      default:
        if (res.statusCode > 200 && res.statusCode < 300) {
          console.info(chalk.bold(startStr, chalk.bgCyan(' ⓘ INFO '), endStr));
        } else {
          console.info(chalk.bold(startStr, chalk.bgRed(' ✘ ERROR '), endStr));
        }
    }
  });

  next();
};

export default LogAllIncomingRoutes;