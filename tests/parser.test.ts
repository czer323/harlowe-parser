/// <reference types="vitest" />

// If Chevrotain is needed, import as:
// import * as chevrotain from 'chevrotain';

import { describe, expect, it } from "vitest";

import { HarloweLexer } from "../src/lexer.js";
import { HarloweParser } from "../src/parser.js";

describe("HarloweParser", () => {
	function parse(input: string) {
		const lexResult = HarloweLexer.tokenize(input);
		const parser = new HarloweParser();
		parser.input = lexResult.tokens;
		const cst = parser.passage();
		return { cst, lexResult, parser };
	}

	it("parses a passage header and plain text", () => {
		const input = ":: My Passage\nHello world!";
		const { cst, parser } = parse(input);
		expect(parser.errors).toHaveLength(0);
		expect(cst.name).toBe("passage");
	});

	it("parses a macro call", () => {
		const input = '(set: $foo to "bar")';
		const { cst, parser } = parse(input);
		expect(parser.errors).toHaveLength(0);
		expect(cst.name).toBe("passage");
	});

	it("recovers from errors", () => {
		const input = "(set: $foo to @@@)";
		const { parser } = parse(input);
		expect(parser.errors.length).toBeGreaterThanOrEqual(1);
	});

	it("tracks CST node locations", () => {
		const input = ':: Header\n(set: $x to "y")';
		const { cst } = parse(input);
		expect(cst.location).toBeDefined();
		expect(cst.location?.startLine).toBe(1);
	});
});
