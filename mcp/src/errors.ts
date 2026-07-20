/**
 * Structured error type for the Meteo Italia MCP server.
 *
 * Used both for network failures (timeouts, retries exhausted, 429s) and for
 * malformed upstream responses that fail zod validation. Surfacing a `code`
 * lets the MCP client and the debug page show a human-readable, actionable
 * message instead of an opaque `undefined`.
 */
export class MeteoError extends Error {
  /** Stable machine code, e.g. "TIMEOUT", "UPSTREAM_429", "BAD_RESPONSE". */
  code: string;
  /** Original cause when wrapping a lower-level error. */
  cause?: unknown;

  constructor(code: string, message: string, cause?: unknown) {
    super(message);
    this.name = "MeteoError";
    this.code = code;
    this.cause = cause;
    // Restore prototype chain for instanceof checks after TS target transpile.
    Object.setPrototypeOf(this, MeteoError.prototype);
  }
}
