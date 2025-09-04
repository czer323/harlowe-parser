// Harlowe Chevrotain Lexer (minimal foundation)
// See: https://chevrotain.io/docs/ and implementation plan
import * as chevrotain from "chevrotain";

// --- Token Definitions ---

// Passage header: :: name (optionally with tags)
// Passage header: :: name [tags]
export const PassageHeader = chevrotain.createToken({
	name: "PassageHeader",
	// Greedily match :: Name [tags] (header and tags as one token)
	pattern: /::\s[^\n]+/,
	line_breaks: false,
});

// Macro call start: (
export const LParen = chevrotain.createToken({
	name: "LParen",
	pattern: /\(/,
});

// Macro call end: )
export const RParen = chevrotain.createToken({
	name: "RParen",
	pattern: /\)/,
});

// Hook start: [
export const LSquare = chevrotain.createToken({
	name: "LSquare",
	pattern: /\[/,
});

// Hook end: ]
export const RSquare = chevrotain.createToken({
	name: "RSquare",
	pattern: /\]/,
});

// Link start: [[
export const LinkStart = chevrotain.createToken({
	name: "LinkStart",
	pattern: /\[\[/,
});

// Link end: ]]
export const LinkEnd = chevrotain.createToken({
	name: "LinkEnd",
	pattern: /\]\]/,
});

// Link separator: ->
export const LinkArrow = chevrotain.createToken({
	name: "LinkArrow",
	pattern: /->/,
});

// Link separator: |
export const LinkPipe = chevrotain.createToken({
	name: "LinkPipe",
	pattern: /\|/,
});

// Macro name: e.g., set, print, etc. (identifier followed by colon)
export const MacroName = chevrotain.createToken({
	name: "MacroName",
	pattern: /[a-zA-Z_][a-zA-Z0-9_-]*:/,
});

// Variable: $name
export const Variable = chevrotain.createToken({
	name: "Variable",
	pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/,
});

// String literal: "..."
export const StringLiteral = chevrotain.createToken({
	name: "StringLiteral",
	// Match string with escaped quotes, brackets, and parentheses
	pattern: /"(?:[^"\\]|\\["\\[\]()]|\\.)*"/,
});

// Operator: +, -, *, /, to, etc.
export const Operator = chevrotain.createToken({
	name: "Operator",
	pattern: /\+|-|\*|\/|to/,
});

// Whitespace (skip)
export const WhiteSpace = chevrotain.createToken({
	name: "WhiteSpace",
	pattern: /[ \t\r]+/, // Exclude newlines so Newline token is produced
	group: chevrotain.Lexer.SKIPPED,
	line_breaks: false,
});

// Comment: multi-line HTML comments (<!-- ... -->) or single-line <! ...>
export const Comment = chevrotain.createToken({
	name: "Comment",
	// Robust multi-line HTML comment matcher using custom exec
	pattern: {
		exec: (text: string, startOffset: number) => {
			// Debug log
			if (typeof console !== "undefined") {
				console.log("[CommentMatcher]", {
					startOffset,
					preview: text.slice(startOffset, startOffset + 40),
				});
			}
			const start = text.indexOf("<!--", startOffset);
			if (start !== startOffset) return null;
			const end = text.indexOf("-->", startOffset + 4);
			if (end === -1) return null;
			const match = text.slice(startOffset, end + 3);
			const arr = [match] as any; // Chevrotain expects RegExpExecArray, but this works at runtime
			arr.index = startOffset;
			arr.input = text;
			return arr;
		},
		test: (text: string, startOffset: number) => {
			return text.indexOf("<!--", startOffset) === startOffset;
		},
	} as any, // Bypass TS signature check
	line_breaks: true,
	start_chars_hint: ["<"],
});

// Newline (for explicit line handling)
export const Newline = chevrotain.createToken({
	name: "Newline",
	pattern: /\r?\n/,
	line_breaks: true,
});

// Plain text: any sequence of non-token characters (greedy, but does NOT consume newlines)
export const PlainText = chevrotain.createToken({
	name: "PlainText",
	// Match anything except explicit tokens and newlines, but allow escaped brackets, parens, quotes
	// Greedy, will match until a token (macro, header, etc.) or newline is found
	pattern: /(?:[^[\]()$+\-*/:"@<\r\n\\]|\\["'()[\]])+/,
});

// Fallback/error token
export const ErrorToken = chevrotain.createToken({
	name: "ErrorToken",
	pattern: /./,
});

// --- Token Order ---
export const allTokens: chevrotain.TokenType[] = [
	WhiteSpace, // skipped
	Comment,
	PassageHeader,
	LinkStart,
	LinkEnd,
	LParen,
	RParen,
	LSquare,
	RSquare,
	LinkArrow,
	LinkPipe,
	MacroName,
	Variable,
	StringLiteral,
	Operator,
	Newline,
	PlainText,
	ErrorToken, // fallback
];

// --- Lexer Instance ---
export const HarloweLexer = new chevrotain.Lexer(allTokens, {
	positionTracking: "full", // enables line/column tracking
});

// --- Export for use in parser/tests ---
export default HarloweLexer;
