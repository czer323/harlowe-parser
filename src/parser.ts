// Harlowe Chevrotain Parser (minimal foundation)
// Follows Chevrotain best practices for CST output and extensibility

// Minimal CST parser for Harlowe passages

import * as chevrotain from "chevrotain";
import {
	allTokens,
	ErrorToken,
	LParen,
	MacroName,
	Newline,
	Operator,
	PassageHeader,
	PlainText,
	RParen,
	StringLiteral,
	Variable,
} from "./lexer.js";

// Define tokens for hooks if not already present in lexer
const LSquare = chevrotain.createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = chevrotain.createToken({ name: "RSquare", pattern: /\]/ });

export class HarloweParser extends chevrotain.CstParser {
	public file!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public passage!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public statement!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public macroCall!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public expr!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public binaryExpr!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public primaryExpr!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public hook!: chevrotain.ParserMethod<[], chevrotain.CstNode>;

	constructor() {
		super([...allTokens, LSquare, RSquare], {
			nodeLocationTracking: "full",
			recoveryEnabled: false,
		});
		// Add new rules after super()
		this.binaryExpr = this.RULE("binaryExpr", () => {
			this.SUBRULE(this.primaryExpr);
			this.MANY(() => {
				this.CONSUME(Operator);
				this.SUBRULE2(this.primaryExpr);
				// For now, just parse as a flat sequence; AST construction will be handled in CST-to-AST step
			});
		});
		this.primaryExpr = this.RULE("primaryExpr", () => {
			this.OPTION(() => {
				this.CONSUME1(Operator);
			});
			return this.OR([
				{ ALT: () => this.CONSUME(Variable) },
				{ ALT: () => this.CONSUME(StringLiteral) },
				{ ALT: () => this.SUBRULE(this.macroCall) },
				{ ALT: () => this.SUBRULE(this.hook) },
				{ ALT: () => this.CONSUME2(Operator) },
				{ ALT: () => this.CONSUME(PlainText) },
				{ ALT: () => this.CONSUME(ErrorToken) },
			]);
		});

		// Entry point: a file is a sequence of comments, newlines, and passages
		this.file = this.RULE("file", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.CONSUME(Comment) },
					{ ALT: () => this.CONSUME(Newline) },
					{ ALT: () => this.SUBRULE(this.passage) },
				]);
			});
		});

		// A passage starts with a header and has statements/newlines until the next header or EOF
		this.passage = this.RULE("passage", () => {
			this.CONSUME(PassageHeader);
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.statement) },
					{ ALT: () => this.CONSUME(Newline) },
				]);
			});
		});

		this.statement = this.RULE("statement", () => {
			return this.OR([
				{ ALT: () => this.SUBRULE(this.macroCall) },
				{ ALT: () => this.SUBRULE(this.hook) },
				{ ALT: () => this.CONSUME(Comment) },
				{ ALT: () => this.CONSUME(PlainText) },
				{ ALT: () => this.CONSUME(ErrorToken) },
			]);
		});

		this.macroCall = this.RULE("macroCall", () => {
			this.CONSUME(LParen);
			this.CONSUME(MacroName);
			this.MANY(() => {
				this.SUBRULE(this.expr);
			});
			this.OPTION(() => {
				this.CONSUME(RParen);
			});
		});

		this.expr = this.RULE("expr", () => {
			// Allow chained binary expressions and keywords like 'to'
			this.SUBRULE(this.primaryExpr);
			this.MANY(() => {
				this.CONSUME(Operator);
				this.SUBRULE2(this.primaryExpr);
			});
		});
		// Add support for hooks: [ ...statements... ]
		this.hook = this.RULE("hook", () => {
			this.CONSUME(LSquare);
			this.MANY(() => {
				this.SUBRULE(this.statement);
			});
			this.CONSUME(RSquare);
		});

		this.performSelfAnalysis();
	}
}

export default HarloweParser;
