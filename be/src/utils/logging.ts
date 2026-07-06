/* eslint-disable no-console */
/**
 * ANSI escape codes to color text in Terminal Ubuntu
 */
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

/**
 * Formatted log string with timestamp and service name
 *
 * @param serviceName - Name of the service or module logging the message
 * @param message - The message to log
 * @param level - Log level (INFO, WARN, ERROR)
 */
function normalizeMessage(
  serviceName: string,
  message: string,
  level: string = 'INFO'
): string {
  const timestamp = new Date().toISOString();
  return `[${serviceName} - ${timestamp}] [${level}]: ${message}`;
}

/**
 * Log an informational message with consistent formatting (console only).
 *
 * @param serviceName - Name of the service or module logging the message
 * @param message - The message to log
 */
export function logInfo(serviceName: string, message: string): void {
  const formattedMessage = normalizeMessage(serviceName, message, 'INFO');
  console.log(`${COLORS.green}${formattedMessage}${COLORS.reset}`);
}

/**
 * Log a warning message with consistent formatting (console only).
 *
 * @param serviceName - Name of the service or module logging the message
 * @param message - The message to log
 */
export function logWarning(serviceName: string, message: string): void {
  const formattedMessage = normalizeMessage(serviceName, message, 'WARN');
  console.warn(`${COLORS.yellow}${formattedMessage}${COLORS.reset}`);
}

/**
 * Log an error message with consistent formatting (console only).
 *
 * @param serviceName - Name of the service or module logging the message
 * @param message - The message to log
 */
export function logError(serviceName: string, message: string): void {
  const formattedMessage = normalizeMessage(serviceName, message, 'ERROR');
  console.error(`${COLORS.red}${formattedMessage}${COLORS.reset}`);
}
