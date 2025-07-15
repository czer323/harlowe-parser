### Performance Implementation Plan

1. **Collect Realistic Benchmark Data**
   - Gather a set of large, representative Harlowe story files and place them in the `examples/` directory.
   - Ensure these files cover a variety of syntax and edge cases.

2. **Create Benchmark Scripts**
   - Write a Node.js script (e.g., `scripts/benchmark.js`) that:
     - Loads each sample file from `examples/`
     - Measures the time taken for lexing and parsing separately (using `console.time`/`console.timeEnd` or a benchmarking library like `benchmark.js`)
     - Optionally, measures memory usage (`process.memoryUsage()`)

3. **Automate Benchmarking**
   - Add a script to `package.json`:

     ```json
     "scripts": {
       "benchmark": "node scripts/benchmark.js"
     }
     ```

   - Run this script manually before releases and after major changes, or schedule it in CI for regular tracking.

4. **Track and Document Metrics**
   - Record benchmark results (e.g., in `docs/performance.md` or as comments in the benchmark script).
   - Include metrics such as average parse time, max parse time, and memory usage for each sample file.
   - Update these metrics after significant changes to the lexer or parser.

5. **Set Performance Budgets**
   - Based on initial benchmarks, define acceptable thresholds for parse time and memory usage (e.g., “Parsing a 100KB story should take < 1s and < 100MB RAM”).
   - Document these targets in `docs/performance.md` and reference them in code review guidelines.

6. **Enforce Performance in Code Review**
   - Require that any PR affecting the lexer or parser includes before/after benchmark results.
   - Reject or request optimization for changes that cause regressions beyond the documented performance budgets.

7. **Optimize as Needed**
   - Profile slow cases using Node.js profilers or Chrome DevTools.
   - Refactor hot paths, optimize regexes, or adjust grammar rules to improve performance.

8. **Communicate and Document**
   - Document the benchmarking process and how to interpret results in the README or a dedicated performance guide.
   - Encourage contributors to run benchmarks before submitting major changes.
