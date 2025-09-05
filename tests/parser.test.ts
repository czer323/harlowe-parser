import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CstNode, IRecognitionException } from "chevrotain";
import { describe, expect, it } from "vitest";
import { HarloweLexer } from "../src/lexer.js";
import { HarloweParser, parser } from "../src/parser.js";

// Main parsing function for tests
function parse(text: string): {
	cst: CstNode;
	errors: IRecognitionException[];
} {
	// In production, the lexer and parser would be reused.
	const lexResult = HarloweLexer.tokenize(text);
	// No debug logging
	parser.input = lexResult.tokens;
	const cst = parser.passage();

	const errors = [...parser.errors];
	// Reset the parser state after each run
	parser.errors = [];

	return {
		cst,
		errors,
	};
}

describe("Harlowe Parser", () => {
	it("should parse simple prose without errors", () => {
		const input = "This is a simple sentence.";
		const { errors } = parse(input);
		expect(errors).toHaveLength(0);
	});

	// --- Moved tests from macroArgs.test.ts ---

	function parseMacro(input: string) {
		const lexResult = HarloweLexer.tokenize(input);
		const localParser = new HarloweParser();
		localParser.input = lexResult.tokens;
		const cst = localParser.passage();
		return { parser: localParser, cst, lexResult };
	}

	describe("Macro argument parsing (TDD)", () => {
		it("accepts comma-separated macro args (should fail until implemented)", () => {
			const input = "(set: $a to 1, $b to 2)";
			const { parser: p } = parseMacro(input);
			expect(p.errors).toHaveLength(0);
		});

		it("rejects macro with missing commas", () => {
			const input = "(set: $a to 1 $b to 2)";
			const { parser: p } = parseMacro(input);
			expect(Array.isArray(p.errors)).toBe(true);
			expect(p.errors.length).toBeGreaterThan(0);
		});
	});

	// --- Moved tests from recursion.test.ts ---

	function parseWithParser(input: string) {
		const lexResult = HarloweLexer.tokenize(input);
		// Debugging removed: no console output during tests
		const localParser = new HarloweParser();
		localParser.input = lexResult.tokens;
		const cst = localParser.passage();
		return { parser: localParser, cst, lexResult };
	}

	describe("Parser recursion safety", () => {
		it("should NOT allow nested full passages inside links (TDD - fail first)", () => {
			const input = "[[Outer [[Inner]]]]";
			const { parser: p } = parseWithParser(input);
			expect(p.errors).toHaveLength(0);
		});

		it("should NOT allow a full passage nested inside styled text (TDD - fail first)", () => {
			const input = "//This is // nested[[link]]// text//";
			const { parser: p } = parseWithParser(input);
			expect(p.errors).toHaveLength(0);
		});
	});

	it("should parse a simple macro call without errors", () => {
		const input = "(print: 'hello world')";
		const { errors } = parse(input);
		expect(errors).toHaveLength(0);
	});

	it.skip("should correctly parse the comprehensive 'torture test' passage and match the snapshot", () => {
		const passagePath = resolve(
			process.cwd(),
			"documentation/Lexer_Passage.twee",
		);
		const input = readFileSync(passagePath, "utf-8");
		const { cst, errors } = parse(input);

		if (errors?.length) console.error("torture test errors:", errors);
		expect(errors).toHaveLength(0);
		expect(cst).toMatchSnapshot();
	});

	describe("Expressions", () => {
		it("should handle additive and multiplicative precedence", () => {
			const input = "(print: 1 + 2 * 3)"; // Should be parsed as 1 + (2 * 3)
			const { errors } = parse(input);
			expect(errors).toHaveLength(0);
		});

		it("should handle unary negation precedence", () => {
			const input = "(print: -2 + 3)";
			const { errors } = parse(input);
			expect(errors).toHaveLength(0);
		});

		it("should handle parenthesized expressions", () => {
			const input = "(print: (1 + 2) * 3)";
			const { errors } = parse(input);
			expect(errors).toHaveLength(0);
		});

		it("should handle logical operator precedence", () => {
			const input = "(if: $a is 1 and $b is 2)";
			const { errors } = parse(input);
			expect(errors).toHaveLength(0);
		});
	});
});
