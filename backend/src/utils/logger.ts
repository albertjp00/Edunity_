import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "winston-daily-rotate-file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const logDirectory = path.resolve(process.cwd(), "../app-logs");

if (!fs.existsSync(logDirectory)) fs.mkdirSync(logDirectory, { recursive: true });

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json() 
);

const logger = winston.createLogger({
  level: "info",
  format: jsonFormat,
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), 

    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "200k",
      maxFiles: "2d",
      level: "info",
      format: jsonFormat,
    }),



    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "1m",
      maxFiles: "2d",
      level: "error",
      format: jsonFormat,
    }),
  ],
});



export default logger;
