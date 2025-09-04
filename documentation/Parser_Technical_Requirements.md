# Harlowe Parser: Technical Requirements

***

## **Technical Requirements: Harlowe Language Parser**

### **1. General Architecture & Core Principles**

1.1. **Technology Stack**: The parser shall be implemented in **TypeScript** using the **Chevrotain** parsing toolkit.

1.2. **Separation of Concerns**: The parser's sole responsibility is to consume a stream of tokens from the lexer and produce a Concrete Syntax Tree (CST). It shall not contain any interpretation, formatting, or semantic analysis logic.

1.3. **Statelessness**: The parser class shall be stateless. All state related to the parsing of a specific text document must be contained within a single invocation of the primary parsing rule.

1.4. **Entry Point**: The parser must expose a single public method (e.g., `parse(tokens: IToken[])`) which accepts a token array from the lexer and returns the parsing result, including the CST and any errors.

***

### **2. Concrete Syntax Tree (CST) Generation Requirements**

The primary output of the parser is a complete and detailed CST.

2.1. **Full Fidelity**: The parser **must not** discard any tokens provided by the lexer. The resulting CST must contain nodes for **all** tokens, including `WhiteSpace`, `HTMLComment`, parentheses, commas, and other delimiters. The lexer must be configured to pass these tokens to the parser, not skip them.

2.2. **Complete Source Location**: Every node in the generated CST, including terminal (token) and non-terminal (rule) nodes, **must** contain accurate source location information. This includes:
    *`startOffset` & `endOffset`
    *   `startLine` & `endLine`
    *   `startColumn` & `endColumn`

2.3. **Unambiguous Node Naming**: Each parsing rule shall produce a CST node whose name directly corresponds to the rule name (e.g., the `macroCall` rule produces a `macroCall` node). This ensures a predictable and navigable tree structure.

2.4. **AST as a Separate Transformation**: The parser's deliverable is the CST. The creation of a simplified Abstract Syntax Tree (AST) for the interpreter will be handled by a separate **CST Visitor** class, which is outside the scope of the parser's core logic.

***

### **3. Error Handling and Recovery**

The parser must be highly resilient to syntax errors to support a real-time editing environment.

3.1. **Non-Terminating Parse**: The parser **must not** halt on the first syntax error. It must attempt to recover and continue parsing the remainder of the document.

3.2. **Comprehensive Error Reporting**: The parser's output object **must** include an array of all syntax errors encountered during the parse, not just the first one. Each error object must include a descriptive message and the source location of the offending token.

3.3. **Implementation of Recovery**: The parser **shall** make effective use of Chevrotain's built-in error recovery mechanisms, including but not limited to:
    *`OPTION`: For optional syntax elements (e.g., a trailing comma).
    *   `MANY` / `AT_LEAST_ONE`: For lists of elements.
    *`OR`: For choosing between alternative syntaxes, with gates to resolve ambiguity.
    *   In-rule recovery using `RECOVER_WITH` or similar techniques where appropriate to prevent cascading errors.

3.4. **Contextual Error Messages**: Where possible, default error messages should be overridden to provide more context specific to Harlowe (e.g., "Mismatched macro name" instead of a generic "Expected Identifier").

***

### **4. Grammatical and Node-Specific Requirements**

The parser must correctly model the following grammatical structures.

4.1. **Expression Precedence**: The parser **must** correctly enforce Harlowe's operator precedence rules by implementing a hierarchical chain of expression-parsing rules. The order of precedence, from highest to lowest, is:
    1.  Primary (Literals, Variables, Parenthesized Expressions)
    2.  Member Access (`'s`, `of`)
    3.  Unary (`not`, `-`)
    4.  Multiplicative (`*`, `/`, `%`)
    5.  Additive (`+`, `-`)
    6.  Comparison (`>`, `<`, `is`, `contains`, `matches`, etc.)
    7.  Logical (`and`, `or`)

4.2. **Changer Attachment**: The grammar must define a `hook` rule that is optionally preceded by an `expression` rule. The parser must recognize this pattern and structure the CST to represent the expression as a "changer" that modifies the hook. The resulting `HookNode` in the CST should have an optional `changer` property.

4.3. **Prose Handling**: Prose (plain text) **shall not** be defined as a token in the lexer. The parser must identify prose as the fallback or default case when no other grammatical rule can be matched at the current position. It will consist of a sequence of tokens that are not delimiters or keywords that start other rules.

4.4. **Recursion**: The parser must correctly handle recursive structures. The content of a `Hook` (`[...]`), `Link` (`[[...]]`), or `StyledText` (`//...//`) is itself a `Passage` and must be parsed by recursively calling the top-level `passage` rule.

4.5. **Verbatim Text**: The parser's `verbatim` rule must be designed to consume a specific `VerbatimContent` token that will be emitted by the lexer when it is in its "verbatim mode". This creates a clear contract between the lexer's modes and the parser's rules.

***

#### **5. Non-Functional Requirements**

5.1. **Performance**: The parser should be efficient. The use of expensive backtracking or high-`k` look-aheads (`LA(k)` where k > 2) should be avoided unless absolutely necessary and justified.

5.2. **Testability**: The parser implementation **must** be accompanied by a comprehensive suite of unit tests.
    ***Valid Cases**: Tests for every valid grammatical construct.
    *   **Invalid Cases**: Tests that verify the parser correctly identifies and recovers from common syntax errors.
    ***Edge Cases**: Tests for empty inputs, nested structures, and complex expressions.
    *   **Snapshot Testing**: CST outputs for representative passages should be captured in snapshot tests to easily detect regressions in the tree structure.

***

### **6. Deliverables**

1. A fully implemented `HarloweParser` class extending `CstParser` from Chevrotain.
2. A complete set of TypeScript `interface` definitions for every node type that can appear in the generated CST.
3. A suite of unit tests as described in section 5.2.
4. A basic `CstVisitor` base class with empty visitor methods for each rule, ready to be extended by other tools.
