import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { HarloweLexer } from "../src/lexer.js";
import { parser } from "../src/parser.js";
import type { CstNode, IRecognitionException } from "chevrotain";

// Main parsing function for tests
function parse(text: string): { cst: CstNode; errors: IRecognitionException[] } {
	// In production, the lexer and parser would be reused.
	const lexResult = HarloweLexer.tokenize(text);
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

	it("should parse a simple macro call without errors", () => {
		const input = "(print: 'hello world')";
		const { errors } = parse(input);
		expect(errors).toHaveLength(0);
	});

	it("should correctly parse the comprehensive 'torture test' passage and match the snapshot", () => {
		const passagePath = resolve(
			process.cwd(),
			"documentation/Lexer_Passage.twee",
		);
		const input = readFileSync(passagePath, "utf-8");
		const { cst, errors } = parse(input);

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
