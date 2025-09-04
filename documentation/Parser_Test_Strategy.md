# Parser Testing Strategy

This document outlines a comprehensive testing strategy for the Harlowe 3.3.8 language parser, implemented using Chevrotain in TypeScript. The goal is to ensure the parser is correct, robust, and performant, particularly in the context of a language server where real-time feedback is essential.

## **Harlowe Parser: Comprehensive Testing Strategy**

### **I. Core Testing Philosophy**

The parser will be evaluated against three primary pillars of quality:

1. **Correctness**: The parser must correctly interpret all valid Harlowe 3.3.8 syntax and produce a predictable, accurate Concrete Syntax Tree (CST).
2. **Robustness**: The parser must gracefully handle malformed, incomplete, and unexpected input without crashing. It must provide clear, actionable error diagnostics and recover wherever possible.
3. **Performance**: The parser must be fast enough to be run in real-time as a user types, providing a seamless experience in a language server environment.

---

### **II. The Test Plan: A Phased Approach**

The testing process will be broken down into the following phases, building from the ground up.

#### **Phase 1: Unit & Integration Testing (Correctness)**

**Goal**: Verify that every individual parsing rule and the parser as a whole function correctly on valid inputs.

1. **Unit Tests for Individual Rules**:
    * **Method**: For each significant rule in the parser (e.g., `macroCall`, `additiveExpression`, `namedHook`), create a dedicated test suite.
    * **Implementation**:
        * Use a "harness" that invokes only the specific rule being tested.
        * Provide a minimal token stream that represents a valid instance of that rule.
        * Assert that the rule successfully parses the stream without errors.
        * Assert that the structure of the generated CST node is exactly as expected.
    * **Example (for `macroCall`)**:
        * Input: Tokens for `(print: "hello")`
        * Assert: The CST node is a `macroCall` with `macroName` "print" and one argument which is a `StringLiteral`.

2. **Integration Tests for Full Passages**:
    * **Method**: Use the "Comprehensive Lexer Test Passage" (our "torture test" file) as the primary input.
    * **Implementation**:
        * Run the full lexer and parser pipeline on the entire passage.
        * Assert that the parser produces **zero errors**.
        * Implement **Snapshot Testing**. The entire generated CST for this passage will be saved to a snapshot file. On subsequent test runs, the new CST will be compared against the saved snapshot. Any deviation will cause the test to fail, immediately flagging a regression.
    * **Rationale**: This ensures that all the rules work together correctly and protects against accidental changes to the CST structure as development progresses.

#### **Phase 2: Negative & Fuzz Testing (Robustness)**

**Goal**: Intentionally try to break the parser to test its error handling, recovery, and resilience. **This is the most critical phase for a language server.**

1. **Negative Unit Tests**:
    * **Method**: For each parsing rule, create a suite of tests with deliberately malformed token streams.
    * **Implementation**:
        * Provide invalid inputs like `(set: $x 5)`, `[[Link->`, `(if: $a > 5`, etc.
        * Assert that the parser does **not** crash or throw an unhandled exception.
        * Assert that the `parser.errors` array contains exactly one (or the expected number of) error(s).
        * Assert that the error message is descriptive and the error location is correct.

2. **Fuzz Testing (Fuzzing)**:
    * **Method**: Fuzzing is the automated generation of random, invalid, or unexpected inputs to test for unhandled edge cases and crashes.
    * **Fuzzing Implementation Plan**:
        * **A. Mutation Fuzzing (Character-Level)**:
            * **Setup**: Use the valid "Comprehensive Test Passage" as a seed input.
            * **Process**: In a loop, create mutated versions of the seed by applying random changes:
                1. **Deletion**: Remove a random character.
                2. **Insertion**: Insert a random character (including Unicode, control characters, and emojis) at a random position.
                3. **Duplication**: Duplicate a random character or a random line.
                4. **Swapping**: Swap two adjacent characters.
            * **Tooling**: A library like `fsfuzz` can be used, or a simple custom script can be written to perform these mutations.

        * **B. Generative Fuzzing (Token-Level)**:
            * **Setup**: Create a list of all valid Harlowe tokens (e.g., `LeftParen`, `RightParen`, `NumberLiteral`, `Variable`, `To`, `And`, etc.).
            * **Process**: Generate a new "passage" by randomly concatenating a sequence of these tokens. This creates syntactically plausible but often nonsensical code that tests complex rule interactions.
            * **Example Output**: `( $myVar is not "hello" [[ to where > )`

    * **Assertions for Fuzz Tests (This is Key)**: The goal of fuzzing is not to check for correct CST output. The goal is to ensure stability. For every fuzzed input, the parser must adhere to these contracts:
        1. **No Unhandled Exceptions**: The `parser.parse()` method **MUST NOT** crash or throw. It must always return a result object. This is the primary assertion.
        2. **Guaranteed Termination**: The parse **MUST** complete within a reasonable timeout (e.g., 500ms). This catches potential infinite loops in the parsing logic.
        3. **The result object is allowed to have an empty/null CST and a non-empty `errors` array.** This is the expected outcome for invalid input.

    * **Integration**: Fuzz tests should be run nightly in a CI/CD pipeline. Any failing input (one that causes a crash) must be saved as a regression test case to be fixed.

#### **Phase 3: Performance & Regression Testing**

**Goal**: Ensure the parser is fast and remains correct over time.

1. **Benchmark Testing**:
    * **Method**: Create an extremely large, valid Harlowe file (e.g., by concatenating the "Comprehensive Test Passage" 1,000 times).
    * **Implementation**:
        * Measure the time taken to lex and parse this large file.
        * Set a performance threshold (e.g., must complete in under 100ms on standard hardware).
        * Run this benchmark as part of the CI pipeline to detect performance regressions.

2. **Regression Suite**:
    * **Method**: All tests created in the previous phases form the regression suite.
    * **Implementation**: This suite must be run automatically via a CI/CD service (like GitHub Actions) on every code commit. A failing test must block the code from being merged, ensuring that no change ever breaks existing functionality.

---

This comprehensive strategy ensures that you are not just testing the "happy path." You are actively trying to destroy your parser from every angle, which is the only way to build the confidence needed for high-quality developer tooling.
