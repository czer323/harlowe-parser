/// <reference types="vitest" />

// If Chevrotain is needed, import as:
// import * as chevrotain from 'chevrotain';

import { describe, expect, it } from "vitest";

import { HarloweLexer } from "../src/lexer.js";
import { HarloweParser } from "../src/parser.js";
import { printCST } from "../src/printCST.js";

describe("HarloweParser", () => {
	function parse(input: string) {
		const lexResult = HarloweLexer.tokenize(input);
		const parser = new HarloweParser();
		parser.input = lexResult.tokens;
		const cst = parser.passage();
		return { cst, lexResult, parser };
	}

	// Test: Should parse a passage header and plain text without errors.
	// Input: A passage with a header and plain text body.
	// Expect: No parser errors, and the CST root node is named "passage".
	it("parses a passage header and plain text", () => {
		const input = ":: My Passage\nHello world!";
		const { cst, parser } = parse(input);
		expect(parser.errors).toHaveLength(0); // No errors expected
		expect(cst.name).toBe("passage"); // CST root should be 'passage'
	});

	// Test: Should parse a macro call without errors.
	// Input: A single macro call (set: $foo to "bar")
	// Expect: No parser errors, and the CST root node is named "passage".
	it("parses a macro call", () => {
		const input = '(set: $foo to "bar")';
		const { cst, parser } = parse(input);
		// Output the CST structure in a readable tree format for inspection
		printCST(cst);
		expect(parser.errors).toHaveLength(0); // No errors expected
		expect(cst.name).toBe("passage"); // CST root should be 'passage'
	});

	// Test: Should recover from a syntax error in the macro call argument.
	// Input: Macro call with invalid argument (set: $foo to @@@)
	// Expect: At least one parser error is reported (error recovery works).
	it("recovers from errors", () => {
		const input = "(set: $foo to @@@)";
		const { parser } = parse(input);
		expect(parser.errors.length).toBeGreaterThanOrEqual(1); // Should report error(s)
	});

	// Test: Should track CST node locations (line/column info).
	// Input: Passage with header and macro call on next line.
	// Expect: CST root node has a location property, and startLine is 1 (header line).
	it("tracks CST node locations", () => {
		const input = ':: Header\n(set: $x to "y")';
		const { cst } = parse(input);
		expect(cst.location).toBeDefined(); // CST node should have location info
		expect(cst.location?.startLine).toBe(1); // Start line should be 1 (header)
	});
});
