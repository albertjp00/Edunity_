import fs from "fs";
import path from "path";


const logsDir = path.resolve(process.cwd(), "../app-logs");

// Helper to read all log files
function getLogFiles() {
  return fs.readdirSync(logsDir).filter((file) => file.endsWith(".log"));
}

// ✅ Define a type for the query filters
interface LogQuery {
  level?: string | undefined; 
  keyword?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

function queryLogs({ level, keyword, startDate, endDate }: LogQuery): LogEntry[] {
  const files = getLogFiles();
  const results: LogEntry[] = [];

  for (const file of files) {
    const filePath = path.join(logsDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    const lines = content.split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const log: LogEntry = JSON.parse(line);
        const time = new Date(log.timestamp);

        if (
          (!level || log.level === level) &&
          (!keyword || log.message.toLowerCase().includes(keyword.toLowerCase())) &&
          (!startDate || time >= new Date(startDate)) &&
          (!endDate || time <= new Date(endDate))
        ) {
          results.push(log);
        }
      } catch (err) {
        console.error("Invalid log line:", (err as Error).message);
      }
    }
  }

  return results;
}


const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

yesterday.setHours(0, 0, 0, 0); 
today.setHours(23, 59, 59, 999); 

const results = queryLogs({
  level: "error", 
  startDate: yesterday.toISOString(),
  endDate: today.toISOString()     
});


console.log(`Found ${results.length} matching logs:\n`);
console.table(
  results.map((log) => ({
    timestamp: log.timestamp,
    level: log.level,
    message: log.message,
  }))
);
