# Lexer Requirements for Harlowe Markup Language

## Understanding a Lexer in Simple Terms

Think of a lexer (also called a tokenizer or a scanner) as the first step in understanding a language, much like how you first learn to recognize individual words and punctuation in a sentence before you can understand its meaning.

A lexer's job is to read the raw text of the code (your Harlowe markup) and break it down into a sequence of meaningful chunks called **tokens**. Each token has a **type** (like `Number`, `String`, `MacroName`) and often a **value** (the actual text it represents, like `123`, `"Hello"`, or `print`).

For example, if the lexer sees `(set: $name to "Jane")`, it would produce a stream of tokens like this:

* `LeftParen`
* `MacroName` ("set")
* `Colon`
* `Variable` ("$name")
* `To` (keyword)
* `StringLiteral` ("\"Jane\"")
* `RightParen`

This stream of tokens is then passed to the next stage, the parser, which understands the grammar and structure of the language. Your focus right now is just on correctly identifying these individual "words" and symbols.

### Basic Requirements and Token Types for a Harlowe Lexer

Here is a breakdown of the different categories of tokens your Harlowe lexer will need to recognize, based on the provided documentation. For use with Chevrotain, you will define these as different `Token` types, often using regular expressions to describe what they look like.

#### 1.  **Whitespace and Comments**

    Although often ignored by the parser, it's crucial for the lexer to identify whitespace to separate other tokens.

    *   **`WhiteSpace`**: This should match one or more spaces, tabs, and newlines (`\s+`). Chevrotain can be configured to automatically skip these.
    *   **`HTMLComment`**: Matches HTML-style comments, e.g., `<!-- This is a comment -->`.
    *   **`HarloweComment` (Future-proofing for 4.0)**: The documentation mentions a new `--` comment style for Harlowe 4.0. You might consider adding this for forward compatibility, matching text that starts with `--`.

#### 2.  **Punctuation and Delimiters**

    These are the single or multi-character symbols that structure the code.

    - **`LeftParen` / `RightParen`**: `(` and `)` for macro calls.
    - **`LeftSquareBracket` / `RightSquareBracket`**: `[` and `]` for hooks.
    - **`LeftDoubleSquareBracket` / `RightDoubleSquareBracket`**: `[[` and `]]` for links.
    - **`LeftCurlyBracket` / `RightCurlyBracket`**: `{` and `}` for collapsing whitespace.
    - **`Colon`**: `:` used in macro calls.
    - **`Comma`**: `,` for separating arguments in macros.
    - **`Dollar`**: `$` for story variables.
    - **`Underscore`**: `_` for temporary variables.
    - **`QuestionMark`**: `?` for hook names.
    - **`Apostrophe`**: `'` for single-quoted strings and datamap access (`'s`).
    - **`DoubleApostrophe`**: `''` for bold text.
    - **`Quote`**: `"` for double-quoted strings.
    - **`Backtick`**: `` ` `` for verbatim text.
    - **`Tilde`**: `~` for strikethrough (`~~`).
    - **`Caret`**: `^` for superscript (`^^`).
    - **`Asterisk`**: `*` for emphasis and bulleted lists.
    - **`Slash`**: `//` for italics.
    - **`Pipe`**: `|` for named hooks and columns.
    - **`Hash`**: `#` for headings and colors.
    - **`Backslash`**: `\` for escaped line breaks.
    - **`LinkArrow`**: `->` or `<-` for links.
    - **`Spread`**: `...` for spreading values in macros.

#### 3.  **Literals**

    These are the raw data values in the language.

    *   **`StringLiteral`**: Text enclosed in single (`'`) or double (`"`) quotes. The lexer will need to handle escaped characters inside the string (like `\"`).
    *   **`NumberLiteral`**: Integers and decimal numbers. The documentation also mentions time-based suffixes like `5s` and `50ms`. Your lexer should be able to handle these.
    *   **`HexColorLiteral`**: Hexadecimal color codes like `#ff0000` or `#a4e`.
    *   **`BooleanLiteral`**: The keywords `true` and `false`. The documentation notes these are case-insensitive in version 3.3.0 and later.

#### 4.  **Keywords**

    These are reserved words with special meaning. The documentation mentions that keywords are generally case-insensitive.

    *   **`To` / `Into`**: Used in `(set:)` and `(put:)` macros.
    *   **`Is` / `IsNot`**: Comparison operators.
    *   **`And` / `Or` / `Not`**: Logical operators.
    *   **`Contains` / `IsIn`**: Containment operators.
    *   **`Matches`**: Pattern matching operator.
    *   **`Bind` / `2Bind`**: For binding variables in macros like `(cycling-link:)`.
    *   **`Where` / `When` / `Via` / `Making` / `Each`**: Used in lambdas.
    *   **Special Keywords**: `it`, `its`, `pos`, `time`, `turns`, `visits`, `exits`.
    *   **Datatype Keywords**: `number`, `string`, `boolean`, `array`, `datamap`, `dataset`, etc., and the `-type` suffix. You might handle `-type` as a separate token or as part of a larger pattern.

#### 5.  **Identifiers**

    These are the names for macros and variables.

    *   **`MacroName`**: A sequence of letters, numbers, and hyphens that appears after a `(`. The documentation states these are case-insensitive and dash-insensitive, which is an important rule for your lexer/parser to handle. For the lexer, you would likely just capture the name as it is written.
    *   **`VariableName`**: Starts with a `$` or `_` followed by letters, numbers, and possibly other characters (the documentation states they cannot begin with a numeral). `$_myVar` would be a `VariableName` token with the value `_myVar`.

#### 6.  **Markup-Specific Tokens**

    While some of these overlap with punctuation, it can be useful to define them as unique tokens to make parsing easier.

    *   **`BoldStart` / `BoldEnd`**: `''`
    *   **`ItalicStart` / `ItalicEnd`**: `//`
    *   **`StrikethroughStart` / `StrikethroughEnd`**: `~~`
    *   **`SuperscriptStart` / `SuperscriptEnd`**: `^^`
    *   **`EmphasisStart` / `EmphasisEnd`**: `_` and `**`
    *   **`BulletedListItem`**: A `*` at the beginning of a line.
    *   **`NumberedListItem`**: `0.` at the beginning of a line.
    *   **`HeadingMarker`**: One to six `#` characters at the start of a line.
    *   **`HorizontalRule`**: Three or more `-` on a line by themselves.
    *   **`Aligner`**: `==>`, `<==`, `=><=`, etc. on a line by themselves.

### How to Approach this with Chevrotain

1. **Create Token Categories**: In Chevrotain, you can create categories for tokens (e.g., `ComparisonOperator`, `LogicalOperator`). This can help in writing the parsing rules later.
2. **Define Tokens with `createToken`**: You'll use Chevrotain's `createToken` function for each token type.

    ```typescript
    import { createToken, Lexer } from "chevrotain";

    // Whitespace (often skipped)
    const WhiteSpace = createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED });

    // Punctuation
    const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
    const RightParen = createToken({ name: "RightParen", pattern: /\)/ });
    const Colon = createToken({ name: "Colon", pattern: /:/ });

    // Keywords (case-insensitive)
    const Set = createToken({ name: "Set", pattern: /set/i, longer_alt: Identifier });

    // Identifiers
    const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_]\w*/ });
    ```

3. **Handle Ambiguities and Keywords**: Notice the `longer_alt` property in the `Set` token example. This is important. A word like "set" could be a keyword or just a regular identifier. You need to tell Chevrotain that if a piece of text matches both `Set` and `Identifier`, it should prefer the `Set` token. You will have a lot of these for Harlowe's keywords (`if`, `else`, `for`, etc.).
4. **Order of Tokens**: The order in which you provide the token definitions to the `Lexer` matters. Chevrotain tries to match tokens in the order they are provided. More specific patterns should generally come before more general ones. For example, `LeftDoubleSquareBracket` (`[[`) should come before `LeftSquareBracket` (`[`).
