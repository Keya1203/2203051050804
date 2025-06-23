// Logging middleware for frontend (API integration)
export async function Log(stack, level, packageName, message) {
  // Allowed values for stack, level, and packageName
  const allowedStacks = ["frontend"];
  const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
  const allowedPackages = ["api", "component", "hook", "page", "state", "style"];

  // Validate values
  if (!allowedStacks.includes(stack)) return;
  if (!allowedLevels.includes(level)) return;
  if (!allowedPackages.includes(packageName)) return;

  // Construct the payload
  const payload = {
    stack,
    level,
    package: packageName,
    message
  };

  // Send POST request to the logging API endpoint
  try {
    await fetch('http://20.244.56.144/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    // No need to handle response for logging middleware
  } catch (error) {
    // Silently ignore errors in logging to avoid interference with app flow
  }
}

export default Log;