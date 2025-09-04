### Error Reporting Implementation Plan

1. **Design Error Data Structure**
   - Define a TypeScript interface for error objects that includes:
     - Error type/category
     - Message (actionable, user-friendly)
     - Line and column number
     - Offending input snippet/context
     - (Optional) Suggestions for resolution

2. **Implement a Custom Chevrotain Error Provider**
   - Create a new file (e.g., `src/errorProvider.ts`).
   - Extend or implement Chevrotain’s `IParserErrorMessageProvider` interface.
   - Customize messages for all error types (mismatched token, no viable alternative, early exit, etc.) to include line/column and actionable advice.
   - Export and integrate this provider in your parser setup.

3. **Integrate Error Context in Parser**
   - Ensure all parser and lexer errors include:
     - The exact line and column (from Chevrotain’s token location info)
     - The relevant input snippet (e.g., a few characters before/after the error)
   - Where possible, add suggestions (e.g., “Did you forget a closing bracket?”).

4. **Surface Errors in the Parse API**
   - In your main parse function (e.g., `src/index.ts`), collect and return all errors in a structured array/object.
   - Ensure errors are accessible to both CLI and programmatic consumers.

5. **Test Error Reporting**
   - Write Vitest tests that:
     - Trigger each type of error (syntax, token, early exit, etc.)
     - Assert that errors include line/column, message, and context
     - Check that actionable suggestions are present where appropriate

6. **Document Error Handling**
   - In the README and API docs, describe:
     - The error structure returned by the parser
     - How to interpret and act on errors
     - Example error messages and their meaning

7. **Review and Iterate**
   - Collect feedback from users and contributors on error clarity.
   - Refine error messages and suggestions based on real-world usage and bug reports.
