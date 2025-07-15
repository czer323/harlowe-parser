---
goal: Harlowe Tokenizer and Parser Implementation Plan
version: 1.1
date_created: 2025-07-13
last_updated: 2025-07-13
owner: harlowe-formatter-team
tags: [feature, parser, tokenizer, harlowe, typescript, chevrotain, jest, fuzzing]
---

# Introduction

This implementation plan outlines the steps and requirements for developing a robust tokenizer and parser for the Harlowe programming language using TypeScript, Chevrotain, and Jest. The goal is to enable accurate, maintainable, and testable parsing of Harlowe syntax for downstream formatting, linting, or analysis tools, with a focus on strong static typing and advanced testing (including grammar-based fuzzing).

## 1. Requirements & Constraints

- **REQ-001**: Tokenize and parse all Harlowe syntax elements (macros, hooks, variables, links, comments, whitespace, aligners, headings, etc.)
- **REQ-002**: Use Chevrotain for both lexing and parsing, leveraging its strong TypeScript support
- **REQ-003**: Provide accurate line/column tracking for all tokens
- **REQ-004**: Support context-sensitive lexing and parsing (e.g., inside macros, comments, or strings)
- **REQ-005**: Distinguish keywords from identifiers using Chevrotain's lexer modes and token types
- **REQ-006**: Handle Unicode and multi-line input
- **REQ-007**: Provide robust error handling and fallback tokens
- **REQ-008**: Ensure all code is written in TypeScript and is fully type-safe, with strong static typing for tokens, AST nodes, and parser rules
- **REQ-009**: All code must be covered by Jest unit tests, including edge cases, error handling, and grammar-based fuzzing
- **CON-001**: Must not break existing formatting or analysis workflows
- **CON-002**: Must be maintainable and extensible for future Harlowe syntax changes
- **GUD-001**: Follow best practices for Chevrotain integration, TypeScript typing, and Jest test structure
- **PAT-001**: Use non-greedy regexes and order rules from most specific to most general

## 2. Implementation Steps

1. Define the full Harlowe syntax to be supported (reference official docs)
2. Design Chevrotain lexer rules for all syntax elements, including modes and keyword distinction
3. Implement the Chevrotain parser for Harlowe grammar, using strongly typed TypeScript classes/interfaces
4. Develop TypeScript interfaces/types for tokens, AST nodes, and parser results
5. Write comprehensive Jest tests for the lexer and parser (unit, edge, error, stateful, Unicode)
6. Implement grammar-based fuzzing tests (e.g., using fast-check or similar) to validate parser robustness
7. Integrate the parser into the main project workflow
8. Document all token types, grammar rules, and error cases
9. Profile and optimize lexer/parser performance
10. Review, refactor, and ensure maintainability

## 3. Alternatives

- **ALT-001**: Use a hand-written tokenizer and parser (rejected: less maintainable, less type-safe, and slower)
- **ALT-002**: Use Nearly.js with Moo (rejected: weaker TypeScript support, less robust error handling, and less active ecosystem)
- **ALT-003**: Use ANTLR4 (considered, but Chevrotain offers better TypeScript ergonomics and easier integration for JS/TS projects)

## 4. Dependencies

- **DEP-001**: TypeScript (>=4.x)
- **DEP-006**: Biome (for code linting/formatting)
- **DEP-007**: Husky and lint-staged (for pre-commit hooks)
- **DEP-002**: Chevrotain (lexer and parser)
- **DEP-003**: Jest (for testing)
- **DEP-005**: Official Harlowe documentation/spec
- **DEP-008**: TypeDoc (for API documentation generation)
- **DEP-009**: GitHub Actions or other CI/CD service
- **DEP-004**: fast-check or similar (for grammar-based fuzzing)

## 5. Files and Build Order

The following files should be created in this order, as each step builds on the previous and enables incremental testing and validation:

1. [ ] **.biome.json** — Linting and formatting configuration files.
2. [ ] **src/types.ts** — TypeScript types/interfaces for tokens, AST, and parser results. (Foundation for all other files.)
3. [ ] **src/lexer.ts** — Chevrotain lexer definition for Harlowe. (Depends on types.)
4. [ ] **src/parser.ts** — Chevrotain parser for Harlowe. (Depends on lexer and types.)
5. [ ] **src/errorProvider.ts** — Custom Chevrotain error provider for user-friendly error messages. (Depends on parser and types.)
6. [ ] **src/index.ts** — Main entry point: exposes parse API, integrates lexer, parser, and error provider. (Depends on all above.)
7. [ ] **tests/lexer.test.ts** — Jest tests for the lexer. (Depends on lexer and types.)
8. [ ] **tests/parser.test.ts** — Jest tests for the parser. (Depends on index, parser, and types.)
9. [ ] **tests/errorProvider.test.ts** — Tests for custom error messages and error handling. (Depends on errorProvider, parser, and index.)
10. [ ] **tests/fuzzing.test.ts** — Grammar-based fuzzing tests for the parser. (Depends on index, parser, lexer.)
11. [ ] **examples/** — Reference Harlowe files/snippets for manual and automated testing. (Used by tests as soon as parser can handle basic constructs.)
12. [ ] **README.md** — Documentation for usage and development.
13. [ ] **CONTRIBUTING.md** — Contribution guidelines for developers.
14. [ ] **CODE_OF_CONDUCT.md** — Code of conduct for community standards.
15. [ ] **CHANGELOG.md** — Project changelog for version tracking.
16. [ ] **.github/ISSUE_TEMPLATE/** — Issue templates for bug reports and feature requests.
17. [ ] **.github/PULL_REQUEST_TEMPLATE.md** — Pull request checklist template.
18. [ ] **.github/workflows/ci.yml** — CI workflow configuration (e.g., GitHub Actions).
19. [ ] **scripts/generateDocs.ts** (optional) — Script to auto-generate grammar/token docs from source.

## 6. Testing

- **TEST-011**: Linting and formatting checks (run via CI and pre-commit hooks)
- **TEST-012**: CI workflow validation (ensure all checks pass on PRs and main branch)
- **TEST-001**: Unit tests for each token type and parser rule (start after lexer and parser are ready)
- **TEST-002**: Edge case tests (empty input, ambiguous tokens, overlapping rules)
- **TEST-003**: State/mode transition tests (e.g., inside macros, comments)
- **TEST-004**: Error handling tests (invalid input, error tokens, parser errors)
- **TEST-005**: Line/column tracking validation
- **TEST-006**: Keyword/identifier distinction tests
- **TEST-007**: Unicode and multi-line input tests
- **TEST-008**: Parser integration and error recovery tests
- **TEST-009**: Grammar-based fuzzing tests to validate parser robustness and catch edge cases (add after parser/lexer are stable)
- **TEST-010**: Reference data tests using real Harlowe files/snippets (begin as soon as parser can handle basic constructs; expand coverage as grammar grows)
- **TEST-013**: Documentation generation and coverage checks (ensure TypeDoc and README are up to date)
- **TEST-014**: Versioning and changelog update checks (ensure releases are tagged and changelog is current)
- **TEST-015**: Contribution and code of conduct compliance (ensure PRs follow guidelines)

**Testing should be incremental:**

- Run linting, formatting, and CI checks on every commit and PR.
- Test the lexer as soon as it is implemented.
- Test the parser with simple, hand-crafted examples as soon as possible.
- Begin using reference data and real Harlowe files as soon as the parser can handle a meaningful subset of the language.
- Add fuzzing and error tests after basic parser/lexer tests are passing.
- Validate documentation and changelog updates before releases.

## 9. Incremental Build and Test Strategy

The project should be built and tested incrementally, with each file and feature validated as soon as it is implemented. Dependencies between files are as follows:

- `types.ts` → `lexer.ts`, `parser.ts`, `errorProvider.ts`, `index.ts`, tests
- `lexer.ts` → `parser.ts`, `index.ts`, tests
- `parser.ts` → `errorProvider.ts`, `index.ts`, tests
- `errorProvider.ts` → `index.ts`, tests
- `index.ts` → all tests

Reference data and real Harlowe files should be used for testing as soon as the parser can handle basic constructs, and coverage should be expanded as the grammar grows.

## 7. Risks & Assumptions

- **RISK-001**: Harlowe syntax may evolve, requiring future updates
- **RISK-002**: Ambiguous or undocumented syntax could cause parsing errors
- **RISK-003**: Chevrotain learning curve may slow initial development
- **ASSUMPTION-001**: Official Harlowe documentation is accurate and up-to-date

## 8. Related Specifications / Further Reading

- [Chevrotain Documentation](https://chevrotain.io/docs/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [fast-check Docs](https://dubzzz.github.io/fast-check.github.com/)
- [TypeDoc Documentation](https://typedoc.org/)
- [Biome Documentation](https://biomejs.dev/guides/getting-started/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Keep a Changelog](https://keepachangelog.com/)
- [Harlowe Syntax Reference](https://twine2.neocities.org/)
