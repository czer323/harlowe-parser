# Vitest Migration Notes

- Jest, ts-jest, and related config have been removed.
- Vitest is now the test runner. See `vitest.config.ts` for config.
- Run tests with:
  
  ```sh
  npx vitest run
  ```

  or for watch mode:

  ```sh
  npx vitest
  ```

- Coverage: `npx vitest run --coverage`
- UI: `npx vitest --ui`

## To Do

- Remove any remaining Jest/ts-jest references from docs and plans.
- Update test file extensions to `.test.ts` if needed.
- Update test imports if any Jest-specific globals are used.
