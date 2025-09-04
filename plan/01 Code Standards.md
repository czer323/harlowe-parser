# Coding Standards Implementation Plan

1. **Select and Configure Tools**
   - Choose Biome for linting and code formatting.

2. **Create and Commit Configuration Files**
   - Add `.biome.json` for Biome rules.
  
3. **Automate Formatting and Linting**
   - Add scripts to `package.json`

      ```json
      "scripts": {
        "lint": "biome lint .",
        "format": "biome format . --write .",
        "prepare": "husky install"
      }
      ```

   - Run `npm run lint` and `npm run format` regularly.

4. **Enforce Standards on Commit**
   - Install Husky and lint-staged:  
     `npm install --save-dev husky lint-staged`
   - Add Husky pre-commit hook:

     ```terminal
     npx husky install
     npx husky add .husky/pre-commit "npx lint-staged"
     ```

   - Configure `lint-staged` in `package.json`

5. **Integrate with CI**
   - Update your CI workflow (e.g., GitHub Actions) to run `npm run lint` and `npm run format -- --check` on every push and pull request.

6. **Document Coding Standards**
   - Add a section in `README.md` describing the enforced code style, how to run lint/format scripts, and the pre-commit/CI process.
   - Optionally, provide code examples and links to Biome documentation.

7. **Review and Enforce in Code Reviews**
   - Require all pull requests to pass linting and formatting checks before merging.
   - Reviewers should reject PRs that do not comply with the documented standards.

## Summary

Basically, the key steps are:

- Ensure code is formatted: `npm run format`
- Ensure linting tests pass: `npm run lint`
- Ensure typecheck passes: `npm run typecheck`
- Ensure tests pass: `npm run test`
