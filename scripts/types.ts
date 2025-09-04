// Shared types for parse results, errors, etc. (batch parsing)

/**
 * Result of parsing a single file.
 */
export interface ParseResult {
  file: string; // Path to the file
  success: boolean;
  errors: ParseError[];
  warnings?: string[];
  ast?: unknown; // AST or CST root node
}

/**
 * Aggregated report for all files.
 */
export interface AggregatedReport {
  total: number;
  passed: number;
  failed: number;
  results: ParseResult[];
}

/**
 * Error encountered during parsing.
 */
export interface ParseError {
  message: string;
  line?: number;
  column?: number;
  context?: string;
}
