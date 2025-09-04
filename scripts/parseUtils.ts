// Parsing/tokenization helpers for batch parsing
import { HarloweLexer } from "../src/lexer.js";
import { HarloweParser } from "../src/parser.js";
import { findExampleFiles, readFile } from "./fileUtils.js";
import type { ParseResult } from "./types.js";

/**
 * Parse a single example file.
 * @param filePath - Path to the .twee file
 * @returns ParseResult
 */
export async function parseExample(filePath: string): Promise<ParseResult> {
  const input = await readFile(filePath);
  const lexResult = HarloweLexer.tokenize(input);
  const parser = new HarloweParser();
  parser.input = lexResult.tokens;
  const cst = parser.passage();
  const errors = [
    ...lexResult.errors.map(e => ({ message: e.message, line: e.line, column: e.column })),
    ...parser.errors.map(e => ({ message: e.message, line: e.token?.startLine, column: e.token?.startColumn })),
  ];
  return {
    file: filePath,
    success: errors.length === 0,
    errors,
    ast: cst,
  };
}

/**
 * Parse all .twee files in a directory (recursively).
 * @param inputDir - Directory to search
 * @returns Array of ParseResult
 */
export async function parseAllFiles(inputDir: string): Promise<ParseResult[]> {
  const files = await findExampleFiles(inputDir, ".twee");
  const results: ParseResult[] = [];
  for (const file of files) {
    results.push(await parseExample(file));
  }
  return results;
}
