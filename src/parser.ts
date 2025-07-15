// Harlowe Chevrotain Parser (minimal foundation)
// Follows Chevrotain best practices for CST output and extensibility

// Minimal CST parser for Harlowe passages

import * as chevrotain from "chevrotain";
import {
	allTokens,
	ErrorToken,
	LParen,
	MacroName,
	Operator,
	PassageHeader,
	PlainText,
	RParen,
	StringLiteral,
	Variable,
} from "./lexer.js";

export class HarloweParser extends chevrotain.CstParser {
	public passage!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public statement!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public macroCall!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public expr!: chevrotain.ParserMethod<[], chevrotain.CstNode>;

	constructor() {
		super(allTokens, {
			nodeLocationTracking: "full", // enable CST node location info
			recoveryEnabled: true, // enable error recovery for robustness
		});
		const $ = this;

		this.passage = $.RULE("passage", () => {
			$.OPTION(() => {
				$.CONSUME(PassageHeader);
			});
			$.MANY(() => {
				return $.SUBRULE(this.statement);
			});
		});

		this.statement = $.RULE("statement", () => {
			return $.OR([
				{ ALT: () => $.SUBRULE(this.macroCall) },
				{ ALT: () => $.CONSUME(PlainText) },
				{ ALT: () => $.CONSUME(ErrorToken) },
			]);
		});

		this.macroCall = $.RULE("macroCall", () => {
			$.CONSUME(LParen);
			$.CONSUME(MacroName);
			$.MANY(() => {
				return $.SUBRULE(this.expr);
			});
			$.CONSUME(RParen);
		});

		this.expr = $.RULE("expr", () => {
			return $.OR([
				{ ALT: () => $.CONSUME(Variable) },
				{ ALT: () => $.CONSUME(StringLiteral) },
				{ ALT: () => $.CONSUME(Operator) },
				{ ALT: () => $.CONSUME(PlainText) },
			]);
		});

		this.performSelfAnalysis();
	}
}

export default HarloweParser;
