// Aggregation and reporting logic for batch parsing
import type { AggregatedReport, ParseResult } from "./types.js";
import { promises as fs } from "fs";

/**
 * Aggregate parse results into a summary report.
 */
export function aggregateResults(results: ParseResult[]): AggregatedReport {
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}

/**
 * Write a JSON report to disk.
 */
export async function writeJsonReport(report: AggregatedReport, path: string) {
  await fs.writeFile(path, JSON.stringify(report, null, 2), "utf8");
}

/**
 * Write a Markdown summary report to disk.
 */
export async function writeMarkdownReport(report: AggregatedReport, path: string) {
  let md = `# Harlowe Batch Parse Report\n\n`;
  md += `**Total:** ${report.total}  |  **Passed:** ${report.passed}  |  **Failed:** ${report.failed}\n\n`;
  md += `| File | Status | Errors |\n|------|--------|--------|\n`;
  for (const r of report.results) {
    md += `| ${r.file} | ${r.success ? "✅ Pass" : "❌ Fail"} | ${r.errors.map(e => e.message).join("; ")} |\n`;
  }
  await fs.writeFile(path, md, "utf8");
}

/**
 * Write failure files for failed parses (for debugging).
 */
export async function writeFailureFiles(failures: ParseResult[], dir: string) {
  await fs.mkdir(dir, { recursive: true });
  for (const fail of failures) {
    const outPath = `${dir}/${fail.file.replace(/[^a-zA-Z0-9_-]/g, "_")}.fail.txt`;
    await fs.writeFile(outPath, JSON.stringify(fail, null, 2), "utf8");
  }
}
