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
});
