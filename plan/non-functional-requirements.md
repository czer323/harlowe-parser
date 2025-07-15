
# Harlowe Formatter Non-Functional Requirements

## Project-Specific Non-Functional Requirements and Strategies

1. **Coding Standards**
   - *Requirement:* All code must follow consistent linting and formatting rules.
   - *Strategy:*
     - Enforce linting and formatting via pre-commit hooks (e.g., Husky) and CI checks.
     - Provide a shared Biome configuration in the repository.
     - Document code style guidelines in the README.

2. **Continuous Integration**
   - *Requirement:* Automated CI/CD pipelines must run tests, linting, and type checks on every commit/PR.
   - *Strategy:*
     - Set up GitHub Actions or another CI service to run all checks on push and pull requests.
     - Require all checks to pass before merging to main branches.

3. **Performance**
   - *Requirement:* The lexer and parser must be benchmarked on large Harlowe stories; performance targets should be documented.
   - *Strategy:*
     - Create benchmark scripts and include sample large Harlowe files in `examples/`.
     - Track and document performance metrics in the repository.
     - Set and review performance budgets as part of code review.

4. **Extensibility**
   - *Requirement:* The system must be modular and designed for easy extension (e.g., new Harlowe features, custom macros).
   - *Strategy:*
     - Use modular file and class structure (separate lexer, parser, error provider, etc.).
     - Document extension points and provide examples in the README.
     - Write tests for new features as they are added.

5. **Error Reporting**
   - *Requirement:* All errors must include line/column info and actionable messages.
   - *Strategy:*
     - Implement a custom error provider for Chevrotain.
     - Ensure all thrown errors include context and suggestions for resolution.
     - Add tests for error messages and reporting.

6. **Documentation**
   - *Requirement:* All tokens, grammar rules, and public APIs must be documented with JSDoc or TypeScript doc comments.
   - *Strategy:*
     - Require JSDoc/TSdoc comments in code reviews.
     - Use tools (e.g., TypeDoc) to generate API documentation.
     - Keep the README and usage examples up to date.

7. **Security**
   - *Requirement:* Input validation and safe regex practices must be followed to prevent vulnerabilities (e.g., ReDoS).
   - *Strategy:*
     - Review all regexes for safety and efficiency.
     - Add input length checks and validation where appropriate.
     - Document known security considerations and mitigations.

8. **Versioning**
   - *Requirement:* The project must use semantic versioning (SemVer) and document the release process.
   - *Strategy:*
     - Tag releases using SemVer (e.g., 1.0.0, 1.1.0, 2.0.0).
     - Maintain a CHANGELOG.md and document the release workflow in the README.

9. **Community Support**
   - *Requirement:* Contribution guidelines and support channels must be documented in the README.
   - *Strategy:*
     - Provide a CONTRIBUTING.md file and issue/PR templates.
     - List support channels (e.g., GitHub Discussions, email) in the README.
     - Encourage community feedback and contributions.
