import * as log from "loglevel";
import { env } from "@/env.js";

const LOG_LEVEL: log.LogLevelDesc = 
  env.NEXT_PUBLIC_LOG_LEVEL ?? 
  (process.env.NODE_ENV === "production" ? ("warn" as const) : ("debug" as const));

const logger = log.getLogger("default");
logger.setLevel(LOG_LEVEL);

// Log the current log level on initialization
logger.warn("Log level set to", LOG_LEVEL);

export default logger;
