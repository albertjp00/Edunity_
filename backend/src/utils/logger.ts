import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "winston-daily-rotate-file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory, { recursive: true });

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json() // store logs as JSON objects
);

const logger = winston.createLogger({
  level: "info",
  format: jsonFormat,
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // still readable in console

    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "4m",
      maxFiles: "2d",
      level: "info",
      format: jsonFormat, // write JSON to file
    }),

    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "4m",
      maxFiles: "2d",
      level: "error",
      format: jsonFormat,
    }),
  ],
});

export default logger;
