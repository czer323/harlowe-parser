# Batch Parsing Scripts

This directory contains scripts for batch parsing Harlowe `.twee` files, aggregating results, and generating reports.

## Scripts

- `batchParse.ts`: Main entry point. Parses all `.twee` files in a directory, aggregates results, and writes JSON/Markdown reports.
- `parseUtils.ts`: Helpers for parsing/tokenization.
- `reportUtils.ts`: Aggregation and reporting logic.
- `types.ts`: Shared types for parse results, errors, etc.

## Usage

```sh
# From project root (adjust paths as needed)
node ./scripts/batchParse.js [inputDir] [outDir]
```

- `inputDir`: Directory containing `.twee` files (default: `../Example Harlowe Passages`)
- `outDir`: Output directory for reports (default: `../batch-parse-report`)

## Output

- `report.json`: Full parse results and errors
- `report.md`: Markdown summary table
- `failures/`: Individual failure files for debugging
