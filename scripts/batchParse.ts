// Main entry for batch parsing and reporting
import { parseAllFiles } from "./parseUtils.js";
import { aggregateResults, writeFailureFiles, writeJsonReport, writeMarkdownReport } from "./reportUtils.js";

async function main() {
  const inputDir = process.argv[2] || "../reference/Example Harlowe Passages";
  const outDir = process.argv[3] || "../batch-parse-report";
  // Ensure output directory exists
  const fs = await import('fs/promises');
  await fs.mkdir(outDir, { recursive: true });
  const results = await parseAllFiles(inputDir);
  const report = aggregateResults(results);
  await writeJsonReport(report, `${outDir}/report.json`);
  await writeMarkdownReport(report, `${outDir}/report.md`);
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    await writeFailureFiles(failures, `${outDir}/failures`);
  }
  console.log(`Batch parse complete. Total: ${report.total}, Passed: ${report.passed}, Failed: ${report.failed}`);
  console.log(`Reports written to: ${outDir}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
