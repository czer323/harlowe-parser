# Parser Requirements for Building a Formatter and Language Server

When building a parser for a programming language, especially one that will be used in an IDE or editor environment, it's essential to consider not just the immediate needs of parsing but also the downstream tools that will rely on the parser's output. A formatter and a language server are two such tools that require specific features from the parser to function effectively.

Here are the key concepts and strategies you should implement during the parsing stage to ensure your parser is robust and future-proof.

---

## 1. Embrace the Concrete Syntax Tree (CST)

This is the single most important strategy. While the final goal is often an AST (Abstract Syntax Tree), a formatter and language server benefit immensely from the initial output of the parser being a **Concrete Syntax Tree (CST)**.

* **What it is:** A CST is a parse tree that represents the *exact* syntax of the source code. It includes **every single token**, including whitespace, comments, parentheses, commas, and other punctuation. An AST, by contrast, is an abstraction that captures the code's meaning but throws away this "syntactic noise."
* **Why it's crucial for your tools:**
  * **Formatter:** A formatter's entire job is to manipulate whitespace and line breaks. If your parser throws away whitespace tokens, the formatter has no information to work with. With a CST, your formatter can traverse the tree, analyze the existing whitespace, and then generate new, correctly formatted text from the original tokens.
  * **Language Server:** When suggesting a refactor or displaying an error, the language server needs to know the exact start and end positions of elements, including the surrounding punctuation, to provide accurate highlighting and code modifications.
* **How to implement with Chevrotain:** You're in luck! Chevrotain's parsers generate a CST by default. Your task is to simply **not skip this step**. You will build a CST Visitor to transform the CST into a cleaner AST for the interpreter, but you will keep the CST for your other tools.

**Actionable Strategy:** Design all your subsequent tools (formatter, language server) to consume the CST directly, not the AST.

---

## 2. Capture Full Source Location Information for Every Node

Every node in your CST must have precise location information. This is non-negotiable for a language server.

* **What it is:** For every grammatical element you parse (a macro call, a variable, an expression), you must be able to retrieve its exact location in the source file. This includes:
  * `startOffset` and `endOffset` (the character index in the file)
  * `startLine` and `endLine`
  * `startColumn` and `endColumn`
* **Why it's crucial for your tools:**
  * **Language Server:**
    * **Diagnostics (Errors/Warnings):** To underline a syntax error in the editor, you need its exact coordinates.
    * **Hover Information:** When the user hovers over `$myVar`, the server needs the token's location to know what information to look up and display.
    * **Go to Definition:** Needs the location of the identifier to find its declaration.
* **How to implement with Chevrotain:** Again, Chevrotain does this for you automatically. Every node in the generated CST has a `location` property with all of this information. Your job is to ensure you preserve this information when you later transform the CST into an AST, if you choose to do so.

**Actionable Strategy:** When building your AST from the CST, make sure to copy the `location` property from the CST node to your corresponding AST node.

---

## 3. Implement Robust Error Recovery

A user's code will be in a state of syntax error *most of the time* while they are typing. Your parser cannot simply crash or give up on the first error.

* **What it is:** Error recovery is the ability of a parser to detect a syntax error, report it, and then intelligently re-synchronize itself to continue parsing the rest of the file.
* **Why it's crucial for your tools:**
  * **Language Server:** A language server needs to provide diagnostics for *all* errors in a file, not just the first one. It also needs to provide features like autocomplete even in a partially broken file. If the parser stops, the entire language server becomes useless.
* **How to implement with Chevrotain:** Chevrotain has excellent built-in error recovery mechanisms. You can use methods like `OR`, `OPTION`, `MANY`, etc., which are designed to handle cases where expected tokens are missing. You can also define custom error messages to be more user-friendly.

**Actionable Strategy:**

* Read Chevrotain's documentation on Error Recovery.
* As you write your parsing rules, think about what a user might type incorrectly. For example, in an `(if:)` macro, they might forget the closing parenthesis. Use `OPTION` to make parts of a rule optional where it makes sense.
* Consider creating special **"Error Nodes"** or **"Incomplete Nodes"** in your AST/CST. When the parser recovers from an error, instead of just skipping, it can insert a special node that explicitly marks a broken part of the code. Your language server can then look for these nodes to display diagnostics.

---

## 4. Design for Symbol and Scope Analysis

A language server needs to understand variables and their scopes (where they are valid). While this analysis is typically done in a separate step *after* parsing, the parser's output must make it easy.

* **What it is:** A **Symbol Table** is a data structure that tracks every variable, macro, and hook that is defined, along with its type and where it was defined.
* **Why it's crucial for your tools:**
  * **Language Server:**
    * **Go to Definition:** Looks up the symbol's definition location in the table.
    * **Autocomplete:** Looks at the symbols available in the current scope to suggest completions.
    * **Error Checking:** Can detect errors like using an undefined variable or setting a `const-type` variable twice.
* **How to implement with your parser:** Design your AST/CST nodes to clearly distinguish between a **declaration** and a **usage**.
  * A `(set: $myVar to ...)` call where `$myVar` appears for the first time is a declaration.
  * A `(print: $myVar)` call is a usage.
  * The `TypedVar` node your parser creates is explicitly a declaration of a parameter within a lambda or custom macro.

**Actionable Strategy:** After parsing, you will run a "semantic analysis" pass over the CST. This pass will use a **Visitor** (see below) to traverse the tree, identify all declaration nodes, and populate a Symbol Table.

---

## 5. Use the Visitor Pattern for Tree Traversal

Once you have a CST, you need a clean, maintainable way to work with it. The Visitor pattern is the industry-standard solution.

* **What it is:** A Visitor is a class with methods for "visiting" each type of node in your tree (e.g., `visitMacroCall`, `visitVariable`, etc.). It separates the logic for traversing the tree from the logic you want to execute at each node.
* **Why it's crucial for your tools:** You will have multiple tools that all need to traverse the same CST.
  * **`ASTBuilderVisitor`**: Traverses the CST to create a cleaner AST for the interpreter.
  * **`FormatterVisitor`**: Traverses the CST to reconstruct the source code with new formatting.
  * **`SemanticAnalysisVisitor`**: Traverses the CST to build the Symbol Table.
  * **`InterpreterVisitor`**: Traverses the AST to execute the game logic.
* **How to implement with Chevrotain:** Chevrotain provides a `CstVisitor` base class that you can extend, making this pattern very easy to adopt.

**Actionable Strategy:** Do not write ad-hoc, recursive functions to walk the tree. Start immediately by implementing the Visitor pattern. Create a base visitor and then extend it for each of your tools.

## Summary: From Parser to Tooling

| Concept | Why it's Important for Tooling | Enabled Tool Feature |
| :--- | :--- | :--- |
| **Concrete Syntax Tree (CST)** | Preserves all original source text, including whitespace and comments. | **Formatter**, Accurate Refactoring |
| **Full Source Location Info** | Provides exact start/end coordinates for every language element. | **Diagnostics**, Hover Info, Go to Definition |
| **Robust Error Recovery** | Allows parsing to continue after a syntax error is found. | Real-time Diagnostics, Autocomplete in invalid code |
| **Symbol/Scope Design** | AST/CST nodes distinguish declarations from usages. | Go to Definition, Autocomplete, Type Checking |
| **Visitor Pattern** | Separates the tree structure from the logic that operates on it. | Clean, maintainable implementation of all tools (Formatter, Interpreter, etc.) |

By building your parser with these five concepts in mind, you won't just be parsing Harlowe; you'll be creating an architectural blueprint that makes building a rich, VS Code-style development experience for the language not just possible, but straightforward.
