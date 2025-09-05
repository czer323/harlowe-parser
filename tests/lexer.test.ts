/// <reference types="vitest" />

import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";
import { HarloweLexer } from "../src/lexer.js";

// Helper function to perform lexing and basic validation
const lex = (input: string) => {
	const result = HarloweLexer.tokenize(input);
	if (result.errors.length > 0) {
		console.error("Lexer errors found:", result.errors);
	}
	expect(result.errors).toHaveLength(0);
	return result.tokens;
};

describe("Harlowe Lexer", () => {
	describe("Category 1: Whitespace & Comments", () => {
		it("should tokenize whitespace", () => {
			const tokens = lex("  \t\n\r  ");
			expect(tokens).toHaveLength(0);
		});

		it("should tokenize HTML comments", () => {
			const tokens = lex("<!-- this is a comment -->");
			expect(tokens).toHaveLength(1);
			expect(tokens[0].tokenType.name).toBe("HTMLComment");
		});
	});

	describe("Category 2: Punctuation & Delimiters", () => {
		it("should tokenize parentheses", () => {
			const tokens = lex("()");
			expect(tokens.map((t) => t.tokenType.name)).toEqual(["LParen", "RParen"]);
		});

		it("should prioritize double square brackets over single", () => {
			const tokens = lex("[[]]");
			expect(tokens.map((t) => t.tokenType.name)).toEqual([
				"LeftDoubleSquareBracket",
				"RightDoubleSquareBracket",
			]);
		});
	});

	describe("Category 3: Literals", () => {
		it("should tokenize strings", () => {
			const tokens = lex(`"hello" 'world'`);
			expect(tokens.map((t) => t.tokenType.name)).toEqual([
				"StringLiteral",
				"StringLiteral",
			]);
		});

		it("should tokenize numbers", () => {
			const tokens = lex("123 -45.67 5s");
			expect(tokens.map((t) => t.tokenType.name)).toEqual([
				"NumberLiteral",
				"Minus",
				"NumberLiteral",
				"NumberLiteral",
			]);
		});
	});

	describe("Category 4 & 5: Keywords & Identifiers", () => {
		it("should tokenize identifiers and keywords correctly", () => {
			const tokens = lex("to and it true_story");
			expect(tokens.map((t) => t.tokenType.name)).toEqual([
				"To",
				"And",
				"It",
				"Identifier",
			]);
		});
	});

	describe("Category 6: Markup", () => {
		it("should tokenize simple markup tokens", () => {
			const tokens = lex("// '' ~~ ** ^^");
			expect(tokens.map((t) => t.tokenType.name)).toEqual([
				"Italic",
				"Bold",
				"Strikethrough",
				"Emphasis",
				"Superscript",
			]);
		});
	});

	describe("VerbatimBlock Token", () => {
		it("should tokenize a simple verbatim block", () => {
			const tokens = lex("`hello`");
			expect(tokens[0].tokenType.name).toBe("VerbatimBlock");
			expect(tokens[0].image).toBe("`hello`");
		});

		it("should tokenize a block with nested backticks", () => {
			const tokens = lex("`` `hello` ``");
			expect(tokens[0].tokenType.name).toBe("VerbatimBlock");
			expect(tokens[0].image).toBe("`` `hello` ``");
		});

		it("should tokenize a block containing Harlowe markup", () => {
			const tokens = lex("`(print: 'hello')`");
			expect(tokens[0].tokenType.name).toBe("VerbatimBlock");
			expect(tokens[0].image).toBe("`(print: 'hello')`");
		});

		it("should tokenize multiple levels of nested backticks", () => {
			const tokens = lex("``` `` `hello` `` ```");
			expect(tokens[0].tokenType.name).toBe("VerbatimBlock");
			expect(tokens[0].image).toBe("``` `` `hello` `` ```");
		});

		it("should correctly tokenize text surrounding a verbatim block", () => {
			const tokens = lex("prose `verbatim` prose");
			const tokenNames = tokens.map((t) => t.tokenType.name);
			expect(tokenNames).toEqual(["Identifier", "VerbatimBlock", "Identifier"]);
		});

		it("should tokenize plain text with punctuation", () => {
			const tokens = lex("Hello, world!");
			const tokenNames = tokens.map((t) => t.tokenType.name);
			expect(tokenNames).toEqual([
				"Identifier",
				"Comma",
				"Identifier",
				"ErrorToken",
			]);
		});
	});

	describe("Comprehensive Lexing", () => {
		it("should tokenize the entire Lexer_Passage.twee file without errors", () => {
			const filePath = path.resolve(
				__dirname,
				"../documentation/Lexer_Passage.twee",
			);
			const content = fs.readFileSync(filePath, "utf-8");
			const { errors } = HarloweLexer.tokenize(content);
			expect(errors).toHaveLength(0);
		});
	});
});
