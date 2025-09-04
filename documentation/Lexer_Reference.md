# Complete Lexer Token Reference for Harlowe 3.3.8

***

## Category 1: Whitespace & Comments

These tokens are primarily used to separate other tokens and are often skipped by the parser.

| Token Name | Pattern | Description & Notes |
| :--- | :--- | :--- |
| `WhiteSpace` | `/\s+/` | One or more spaces, tabs, newlines, or other whitespace characters. **Note:** In Chevrotain, this is typically added to the `Lexer.SKIPPED` group. |
| `HTMLComment` | `/<!--[\s\S]*?-->/` | An HTML-style comment. **Note:** The `[\s\S]*?` part is a common way to match any character including newlines, in a non-greedy way. |

---

### Category 2: Punctuation & Delimiters

These are the structural symbols of the language. The order of definition is critical in Chevrotain (e.g., `DoubleSquareBracket` must be defined before `SquareBracket`).

| Token Name | Pattern | Description & Notes |
| :--- | :--- | :--- |
| `LeftParen` | `\(` | Opening parenthesis for a macro. |
| `RightParen` | `\)` | Closing parenthesis for a macro. |
| `LeftDoubleSquareBracket`| `\[\[` | Opening for a link. |
| `RightDoubleSquareBracket`| `\]\]` | Closing for a link. |
| `LeftSquareBracket` | `\[` | Opening for a hook. |
| `RightSquareBracket` | `\]` | Closing for a hook. |
| `UnclosedHook` | `/\[=+` | An unclosed hook, e.g., `[=`, `[==`. |
| `LeftCurlyBracket` | `\{` | Opening for collapsing whitespace. |
| `RightCurlyBracket` | `\}` | Closing for collapsing whitespace. |
| `UnclosedCurly` | `/\{=+` | An unclosed collapsing whitespace marker, e.g., `{=`. |
| `Colon` | `:` | Separator in a macro call. |
| `Comma` | `,` | Separator for arguments in a macro call. |
| `Pipe` | `\|` | Used in named hooks (`|hook>`) and column markup. |
| `LessThan` | `<` | Used in named hooks (`<hook|`) and aligners. |
| `GreaterThan` | `>` | Used in named hooks (`|hook>`) and aligners. |
| `QuestionMark` | `\?` | Sigil for referencing a hook, e.g., `?myHook`. |
| `Dollar` | `\$` | Sigil for a story-wide variable. |
| `Backslash` | `\\` | For escaped line breaks. |
| `LinkArrowRight` | `->` | Arrow for link syntax. |
| `LinkArrowLeft` | `<-` | Arrow for link syntax. |
| `Spread` | `...` | The "spread" operator. |

---

### Category 3: Literals

These tokens represent the actual data values.

| Token Name | Pattern | Description & Notes |
| :--- | :--- | :--- |
| `StringLiteral` | `/"(?:[^"\\]|\\.)*"` OR `/'(?:[^'\\]|\\.)*'/` | Text in double or single quotes. The pattern must account for escaped quotes. |
| `NumberLiteral` | `/-?\d+(?:\.\d+)?(?:ms\|s)?/` | An integer or floating-point number, possibly negative. Also captures optional `ms` or `s` suffixes. |
| `HexColorLiteral`| `/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/` | A CSS-style hexadecimal color code. |
| `BooleanLiteral` | `/true\|false/i` | The keywords `true` or `false`. **Note:** The `/i` makes it case-insensitive. |

---

### Category 4: Keywords

These are reserved words. In Chevrotain, these should be defined *before* the general `Identifier` token, and they should specify `longer_alt: Identifier`.

| Token Name | Pattern | Description & Notes |
| :--- | :--- | :--- |
| **Assignment & Logic** | | |
| `To` | `/to/i` | Keyword for `(set:)`. |
| `Into` | `/into/i` | Keyword for `(put:)`. |
| `And` | `/and/i` | Logical operator. |
| `Or` | `/or/i` | Logical operator. |
| `Not` | `/not/i` | Logical operator. |
| `Is` | `/is/i` | Comparison operator. |
| `In` | `/in/i` | Part of the `is in` operator. |
| `Contains` | `/contains/i` | Comparison operator. |
| `Matches` | `/matches/i` | Comparison operator for patterns. |
| **Binding & Lambdas** | | |
| `Bind` | `/bind/i` | Keyword for variable binding. |
| `TwoBind` | `/2bind/i` | Keyword for two-way variable binding. |
| `Where` | `/where/i` | Lambda keyword. |
| `When` | `/when/i` | Lambda keyword. |
| `Via` | `/via/i` | Lambda keyword. |
| `Making` | `/making/i` | Lambda keyword. |
| `Each` | `/each/i` | Lambda keyword. |
| **Special Identifiers** | | These act like variables but are keywords. |
| `It` | `/it/i` | Contextual keyword. |
| `Its` | `/its/i` | Possessive of `it`. |
| `Pos` | `/pos/i` | Position keyword in lambdas. |
| `Time` | `/time/i` | Time elapsed keyword. |
| `Turns` | `/turns\|turn/i` | Turn count keyword. |
| `Visits` | `/visits\|visit/i` | Visit count keyword. |
| `Exits` | `/exits\|exit/i` | Exit count keyword. |
| **Datatypes** | | |
| `TypeSuffix` | `/-type/i` | Suffix used for TypedVars, e.g., `num-type`. |
| `Datatype` | *See Note* | Matches all built-in datatypes (`number`, `string`, `const`, `any`, etc.). **Note:** It's best to define each datatype as its own keyword token (e.g., `NumberType`, `StringType`) for clarity. |

---

### Category 5: Identifiers

These are names created by the author.

| Token Name | Pattern | Description & Notes |
| :--- | :--- | :--- |
| `Variable` | `/[_a-zA-Z][_a-zA-Z0-9]*/` | The name part of a variable or hook. **Note:** This token represents the name *without* the sigil (`$`, `_`, `?`). The sigils should be separate tokens. |

### Category 6: Markup Tokens

These are special sequences for styling and structuring prose. Many are context-dependent (e.g., must be at the start of a line), which the parser will enforce. The lexer just identifies the pattern.

| Token Name | Pattern | Description & Notes |
| :--- | :--- | :--- |
| `Italic` | `\/\/` | `//` for italics. |
| `Bold` | `''` | `''` for bold. |
| `Strikethrough` | `~~` | `~~` for strikethrough. |
| `Emphasis` | `\*\*` | `**` for strong emphasis. **Note:** The single `_` emphasis is ambiguous with the temp variable prefix and is not recommended to be tokenized this way. The parser should handle it. |
| `Superscript` | `\^\^` | `^^` for superscript. |
| `Backtick` | `` ` `` | `` ` `` for verbatim text. **Note:** See "Lexer Strategy" below for handling repeating backticks. |
| `BulletedListMarker` | `\*+(?=\s)` | One or more asterisks at the start of a line, followed by whitespace. |
| `NumberedListMarker` | `(?:0\.)+(?=\s)`| One or more `0.` sequences at the start of a line, followed by whitespace. |
| `HeadingMarker` | `^#{1,6}(?=\s)`| 1 to 6 hash symbols at the start of a line. |
| `HorizontalRule`| `^---\s*$`| Three or more hyphens on a line by themselves. |
| `Aligner` | `^<*={2,}>*$` | An aligner arrow, e.g., `==>`, `<==>`, on a line by itself. |
| `ColumnMarker` | `/^=*\|.*\|=*$/` | Column markup on a line by itself. |

***

### Lexer Configuration and Strategy in Chevrotain

1. **Token Order is Crucial**: When you initialize the Chevrotain `Lexer`, the order of the token array you pass it matters. Place more specific tokens before more general ones.
    * `LeftDoubleSquareBracket` (`[[`) must come before `LeftSquareBracket` (`[`).
    * All **Keyword** tokens (like `Set`, `To`, `If`) must come before the general `Identifier` token.

2. **Keywords vs. Identifiers**: This is the most common challenge. The recommended Chevrotain pattern is:
    * Define a general `Identifier` token.
    * Define each keyword token with its specific pattern (e.g., `/if/i`).
    * On each keyword token, add the `longer_alt: Identifier` property. This resolves ambiguity by telling the lexer, "If the text could be an identifier OR this keyword, pick the keyword."

3. **Modes for Verbatim Text**: The verbatim markup (`` `...` ``) is tricky because it can contain characters that would normally be other tokens. The best way to handle this is with **Lexer Modes**.
    * When your lexer encounters an opening sequence of backticks (e.g., `` `` ` ``), it should count them and push a new "verbatim mode" onto its mode stack.
    * In this mode, you have a different, much simpler set of token rules—basically, one token that matches any character and another that matches the closing backtick sequence (with the same count).
    * When the closing sequence is found, you pop the mode, returning to the default lexing rules.

4. **Context-Sensitivity is a Parser Job**: The lexer's job is to identify tokens, not to understand their context. For example, the lexer will identify a `*` as an `Asterisk` token. It is the **parser's** job to determine if that `Asterisk` is part of a bulleted list (because it's at the start of a line) or part of emphasis markup. Your lexer should be as "dumb" as possible.

This list provides a robust and complete blueprint for your lexer. Following this structure will give you a clean stream of tokens that your parser can then use to build the abstract syntax tree for the Harlowe language.
