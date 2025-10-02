import winston from "winston";

const logger = winston.createLogger({
  level: "info", // default level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // logs in JSON format
  ),
  transports: [
    new winston.transports.Console(), // log to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  ],
});

// If not in production, log simple text to console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
