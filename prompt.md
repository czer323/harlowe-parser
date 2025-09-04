Review this document in it's entirity first.  Understand the steps and the overall goal of the plan. #file:00.3 Harlowe Tokenizer and Parser Plan 

Then Review the overall plan #file:00 Harlowe Parser Implementation Plan.md to understand where we are in the proess.

Review the existing #codebase to understand what we've created already.

Break down the tasks you need to accomplish to achieve each goal, and begin the implementation steps.

The ideal steps include running the batch script to generate parse reports for all example Harlowe passages, and then using the report to identify and fix any parsing issues.  Update the apprpirate files as needed. and continue to iterate on the implementation.

use the minimal report as a guide for what to fix next.  We can iterate on each new failure to complete the project.

## How to Run the Batch Parse Script

To generate parse reports for all example Harlowe passages, run the following command from the project root:

```powershell
node [batchParse.js](http://_vscodecontentref_/0) "C:/Users/czer3/PycharmProjects/harlowe formatter v2/Example Harlowe Passages" "C:/Users/czer3/PycharmProjects/harlowe formatter v2/batch-parse-report"
