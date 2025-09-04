/// <reference types="vitest" />

import { describe, expect, it } from "vitest";
import { HarloweLexer } from "../src/lexer.js";

describe("HarloweLexer", () => {
	it("tokenizes a passage header", () => {
		const input = ":: PassageName\n";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens[0].tokenType.name).toBe("PassageHeader");
		expect(tokens[0].image).toBe(":: PassageName");
	});

	it("tokenizes a macro call", () => {
		const input = '(set: $var to "value")';
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens.map((t) => t.tokenType.name)).toEqual([
			"LParen",
			"MacroName",
			"Variable",
			"Operator",
			"StringLiteral",
			"RParen",
		]);
	});

	it("tokenizes plain text and variables", () => {
		const input = "Hello $name!";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens.map((t) => t.tokenType.name)).toContain("PlainText");
		expect(tokens.map((t) => t.tokenType.name)).toContain("Variable");
	});

	it("tracks line and column numbers", () => {
		const input = ':: Header\n(set: $x to "y")';
		const { tokens } = HarloweLexer.tokenize(input);
		expect(tokens[0].startLine).toBe(1);
		expect(tokens[1].startLine).toBe(2);
	});

	it("produces ErrorToken for unknown input", () => {
		const input = "@@@";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors.length).toBe(0);
		expect(tokens[0].tokenType.name).toBe("ErrorToken");
	});

	// Additional tests for edge cases
	it("tokenizes lines starting with dashes and colons", () => {
		const input = "- This is a dash line\n: This is a colon line\n";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens.map((t) => t.tokenType.name)).toContain("PlainText");
		expect(tokens.map((t) => t.tokenType.name)).toContain("Newline");
	});

	it("tokenizes macro arguments with negative numbers and newlines", () => {
		const input = "(abs: -4)\n";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens.map((t) => t.tokenType.name)).toEqual([
			"LParen",
			"MacroName",
			"Operator",
			"PlainText",
			"RParen",
			"Newline",
		]);
	});

	it("tokenizes a passage header with tags", () => {
		const input = ":: PassageName [tag1 tag2]\n";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		// Actual output: [PassageHeader, Newline]
		expect(tokens.map((t) => t.tokenType.name)).toEqual([
			"PassageHeader",
			"Newline",
		]);
		expect(tokens[0].image).toBe(":: PassageName [tag1 tag2]");
	});

	it("tokenizes hooks", () => {
		const input = "[Hello [nested]]";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		// Actual output: [LSquare, PlainText, LSquare, PlainText, RSquare, RSquare]
		expect(tokens.map((t) => t.tokenType.name)).toEqual([
			"LSquare",
			"PlainText",
			"LSquare",
			"PlainText",
			"RSquare",
			"RSquare",
		]);
	});

	it("tokenizes link syntax", () => {
		const input = "[[Link Text->Passage]] [[Other|Passage]]";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		// Actual output: [LinkStart, PlainText, LinkArrow, PlainText, LinkEnd, LinkStart, PlainText, LinkPipe, PlainText, LinkEnd]
		expect(tokens.map((t) => t.tokenType.name)).toEqual([
			"LinkStart",
			"PlainText",
			"LinkArrow",
			"PlainText",
			"LinkEnd",
			"LinkStart",
			"PlainText",
			"LinkPipe",
			"PlainText",
			"LinkEnd",
		]);
	});

	it("tokenizes escaped characters in string literals", () => {
		const input = '"A \\"quoted\\" [bracket] (paren)"';
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens[0].tokenType.name).toBe("StringLiteral");
		expect(tokens[0].image).toBe(input);
	});

	it("tokenizes escaped characters in plain text", () => {
		const input = "Hello \\[escaped bracket\\] and \\(paren\\)";
		const { tokens, errors } = HarloweLexer.tokenize(input);
		expect(errors).toHaveLength(0);
		expect(tokens[0].tokenType.name).toBe("PlainText");
		expect(tokens[0].image).toBe(input);
	});
});
