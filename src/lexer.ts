// Harlowe Chevrotain Lexer (minimal foundation)
// See: https://chevrotain.io/docs/ and implementation plan
import * as chevrotain from "chevrotain";

// --- Token Definitions ---

// Passage header: :: name (optionally with tags)
export const PassageHeader = chevrotain.createToken({
	name: "PassageHeader",
	pattern: /::\s*[^\n]+/,
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

// Macro name: e.g., set, print, etc. (identifier followed by colon)
export const MacroName = chevrotain.createToken({
	name: "MacroName",
	pattern: /[a-zA-Z_][a-zA-Z0-9_]*:/,
});

// Variable: $name
export const Variable = chevrotain.createToken({
	name: "Variable",
	pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/,
});

// String literal: "..."
export const StringLiteral = chevrotain.createToken({
	name: "StringLiteral",
	pattern: /"(?:[^"\\]|\\.)*"/,
});

// Operator: +, -, *, /, to, etc.
export const Operator = chevrotain.createToken({
	name: "Operator",
	pattern: /\+|-|\*|\/|to/,
});

// Whitespace (skip)
export const WhiteSpace = chevrotain.createToken({
	name: "WhiteSpace",
	pattern: /[ \t\r\n]+/,
	group: chevrotain.Lexer.SKIPPED,
	line_breaks: true,
});

// Plain text (anything else, non-greedy)
export const PlainText = chevrotain.createToken({
	name: "PlainText",
	pattern: /[^\s()$+\-*/:"@]+/,
});

// Fallback/error token
export const ErrorToken = chevrotain.createToken({
	name: "ErrorToken",
	pattern: /./,
});

// --- Token Order ---
export const allTokens: chevrotain.TokenType[] = [
	WhiteSpace, // skipped
	PassageHeader,
	LParen,
	RParen,
	MacroName,
	Variable,
	StringLiteral,
	Operator,
	PlainText,
	ErrorToken, // fallback
];

// --- Lexer Instance ---
export const HarloweLexer = new chevrotain.Lexer(allTokens, {
	positionTracking: "full", // enables line/column tracking
});

// --- Export for use in parser/tests ---
export default HarloweLexer;
