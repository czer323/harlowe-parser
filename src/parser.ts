// Harlowe Chevrotain Parser (minimal foundation)
// Follows Chevrotain best practices for CST output and extensibility

// Minimal CST parser for Harlowe passages

import * as chevrotain from "chevrotain";
import {
	// Full token list
	allTokens,
	// Tokens the parser will use
	And,
	Bind,
	Bold,
	BooleanLiteral,
	// BulletedListMarker, // This will be used when the 'list' rule is restored.
	Colon,
	Comma,
	Contains,
	Dollar,
	Each,
	ErrorToken,
	GreaterThan,
	HeadingMarker,
	HTMLComment,
	Identifier,
	In,
	Into,
	Is,
	Italic,
	Its,
	It,
	LeftCurlyBracket,
	LeftDoubleSquareBracket,
	LeftSquareBracket,
	LessThan,
	LinkArrowLeft,
	LinkArrowRight,
	LParen,
	Matches,
	Not,
	NumberLiteral,
	Or,
	Pipe,
	QuestionMark,
	RightCurlyBracket,
	RightDoubleSquareBracket,
	RightSquareBracket,
	RParen,
	Spread,
	Strikethrough,
	StringLiteral,
	Superscript,
	To,
	Where,
	WhiteSpace,
	// Newly added arithmetic operators
	Plus,
	Minus,
	Multiply,
	Divide,
	Modulo,
	// Other tokens for remaining grammar
	VerbatimBlock,
	Emphasis,
	HorizontalRule,
} from "./lexer.js";

export class HarloweParser extends chevrotain.CstParser {
	// Top-level passage rule
	public passage!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	// Rule to dispatch to various content types (macros, hooks, prose)
	public passageContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	// Rule to consume a single token of prose
	public proseToken!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public macroCall!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public hook!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public link!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public styledText!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public verbatim!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public heading!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	// public list!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public horizontalRule!: chevrotain.ParserMethod<[], chevrotain.CstNode>;

	// Expression Rules (in order of precedence)
	public expression!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public logicalExpression!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public comparisonExpression!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public additiveExpression!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public multiplicativeExpression!: chevrotain.ParserMethod<
		[],
		chevrotain.CstNode
	>;
	public unaryExpression!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public primaryExpression!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public variable!: chevrotain.ParserMethod<[], chevrotain.CstNode>;

	constructor() {
		super(allTokens, {
			recoveryEnabled: true,
			nodeLocationTracking: "full",
		});

		this.passage = this.RULE("passage", () => {
			this.MANY(() => {
				this.SUBRULE(this.passageContent);
			});
		});

		this.passageContent = this.RULE("passageContent", () => {
			this.OR([
				{ ALT: () => this.SUBRULE(this.link) },
				{ ALT: () => this.SUBRULE(this.verbatim) },
				{ ALT: () => this.SUBRULE(this.styledText) },
				{ ALT: () => this.SUBRULE(this.heading) },
				// { ALT: () => this.SUBRULE(this.list) },
				{ ALT: () => this.SUBRULE(this.horizontalRule) },
				{ ALT: () => this.SUBRULE(this.macroCall) },
				{ ALT: () => this.SUBRULE(this.hook) },
				{ ALT: () => this.SUBRULE(this.proseToken) },
			]);
		});

		this.proseToken = this.RULE("proseToken", () => {
			this.OR([
				{ ALT: () => this.CONSUME(Identifier) },
				{ ALT: () => this.CONSUME(WhiteSpace) },
				{ ALT: () => this.CONSUME(HTMLComment) },
				{ ALT: () => this.CONSUME(NumberLiteral) },
				{ ALT: () => this.CONSUME(StringLiteral) },
				{ ALT: () => this.CONSUME(BooleanLiteral) },
				{ ALT: () => this.CONSUME(And) },
				{ ALT: () => this.CONSUME(Or) },
				{ ALT: () => this.CONSUME(Not) },
				{ ALT: () => this.CONSUME(Is) },
				{ ALT: () => this.CONSUME(In) },
				{ ALT: () => this.CONSUME(Contains) },
				{ ALT: () => this.CONSUME(Matches) },
				{ ALT: () => this.CONSUME(To) },
				{ ALT: () => this.CONSUME(Into) },
				{ ALT: () => this.CONSUME(Where) },
				{ ALT: () => this.CONSUME(Bind) },
				{ ALT: () => this.CONSUME(Each) },
				{ ALT: () => this.CONSUME(It) },
				{ ALT: () => this.CONSUME(Its) },
				{ ALT: () => this.CONSUME(Colon) },
				{ ALT: () => this.CONSUME(Comma) },
				{ ALT: () => this.CONSUME(Pipe) },
				{ ALT: () => this.CONSUME(GreaterThan) },
				{ ALT: () => this.CONSUME(LessThan) },
				{ ALT: () => this.CONSUME(QuestionMark) },
				{ ALT: () => this.CONSUME(Dollar) },
				{ ALT: () => this.CONSUME(RParen) },
				{ ALT: () => this.CONSUME(RightSquareBracket) },
				{ ALT: () => this.CONSUME(RightCurlyBracket) },
				{ ALT: () => this.CONSUME(LeftCurlyBracket) },
				{ ALT: () => this.CONSUME(RightDoubleSquareBracket) },
				{ ALT: () => this.CONSUME(LinkArrowLeft) },
				{ ALT: () => this.CONSUME(LinkArrowRight) },
				{ ALT: () => this.CONSUME(Spread) },
				{ ALT: () => this.CONSUME(ErrorToken) },
			]);
		});

		this.link = this.RULE("link", () => {
			this.CONSUME(LeftDoubleSquareBracket);
			this.SUBRULE(this.passage);
			this.CONSUME(RightDoubleSquareBracket);
		});

		this.verbatim = this.RULE("verbatim", () => {
			this.CONSUME(VerbatimBlock);
		});

		this.styledText = this.RULE("styledText", () => {
			this.OR([
				{
					ALT: () => {
						this.CONSUME(Italic);
						this.SUBRULE(this.passage);
						this.CONSUME2(Italic);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Bold);
						this.SUBRULE2(this.passage);
						this.CONSUME2(Bold);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Strikethrough);
						this.SUBRULE3(this.passage);
						this.CONSUME2(Strikethrough);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Superscript);
						this.SUBRULE4(this.passage);
						this.CONSUME2(Superscript);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Emphasis);
						this.SUBRULE5(this.passage);
						this.CONSUME2(Emphasis);
					},
				},
			]);
		});

		this.heading = this.RULE("heading", () => {
			this.CONSUME(HeadingMarker);
		});

		// this.list = this.RULE("list", () => {
		// 	this.OR([
		// 		{ ALT: () => this.CONSUME(BulletedListMarker) },
		// 		{ ALT: () => this.CONSUME(NumberedListMarker) },
		// 	]);
		// });

		this.horizontalRule = this.RULE("horizontalRule", () => {
			this.CONSUME(HorizontalRule);
		});

		this.expression = this.RULE("expression", () => {
			this.SUBRULE(this.logicalExpression);
		});

		this.logicalExpression = this.RULE("logicalExpression", () => {
			this.SUBRULE(this.comparisonExpression, { LABEL: "lhs" });
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.CONSUME(And, { LABEL: "operator" }) },
					{ ALT: () => this.CONSUME(Or, { LABEL: "operator" }) },
				]);
				this.SUBRULE2(this.comparisonExpression, { LABEL: "rhs" });
			});
		});

		this.comparisonExpression = this.RULE("comparisonExpression", () => {
			this.SUBRULE(this.additiveExpression, { LABEL: "lhs" });
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.CONSUME(Is, { LABEL: "operator" }) },
					{ ALT: () => this.CONSUME(Contains, { LABEL: "operator" }) },
					{ ALT: () => this.CONSUME(Matches, { LABEL: "operator" }) },
					{ ALT: () => this.CONSUME(GreaterThan, { LABEL: "operator" }) },
					{ ALT: () => this.CONSUME(LessThan, { LABEL: "operator" }) },
				]);
				this.SUBRULE2(this.additiveExpression, { LABEL: "rhs" });
			});
		});

		this.additiveExpression = this.RULE("additiveExpression", () => {
			this.SUBRULE(this.multiplicativeExpression, { LABEL: "lhs" });
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.CONSUME(Plus, { LABEL: "operator" }) },
					{ ALT: () => this.CONSUME(Minus, { LABEL: "operator" }) },
				]);
				this.SUBRULE2(this.multiplicativeExpression, { LABEL: "rhs" });
			});
		});

		this.multiplicativeExpression = this.RULE(
			"multiplicativeExpression",
			() => {
				this.SUBRULE(this.unaryExpression, { LABEL: "lhs" });
				this.MANY(() => {
					this.OR([
						{ ALT: () => this.CONSUME(Multiply, { LABEL: "operator" }) },
						{ ALT: () => this.CONSUME(Divide, { LABEL: "operator" }) },
						{ ALT: () => this.CONSUME(Modulo, { LABEL: "operator" }) },
					]);
					this.SUBRULE2(this.unaryExpression, { LABEL: "rhs" });
				});
			},
		);

		this.unaryExpression = this.RULE("unaryExpression", () => {
			this.OR([
				{
					ALT: () => {
						this.CONSUME(Not);
						this.SUBRULE(this.unaryExpression);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Minus);
						this.SUBRULE2(this.unaryExpression);
					},
				},
				{ ALT: () => this.SUBRULE(this.primaryExpression) },
			]);
		});

		this.primaryExpression = this.RULE("primaryExpression", () => {
			this.OR([
				{ ALT: () => this.CONSUME(NumberLiteral) },
				{ ALT: () => this.CONSUME(StringLiteral) },
				{ ALT: () => this.CONSUME(BooleanLiteral) },
				{ ALT: () => this.SUBRULE(this.variable) },
				{ ALT: () => this.SUBRULE(this.macroCall) },
				{
					ALT: () => {
						this.CONSUME(LParen);
						this.SUBRULE(this.expression);
						this.CONSUME(RParen);
					},
				},
			]);
		});

		this.variable = this.RULE("variable", () => {
			this.CONSUME(Dollar);
			this.CONSUME(Identifier);
		});

		this.macroCall = this.RULE("macroCall", () => {
			this.CONSUME(LParen);
			this.CONSUME(Identifier);
			this.OPTION(() => {
				this.CONSUME(Colon);
				this.MANY(() => {
					this.SUBRULE(this.expression);
				});
			});
			this.CONSUME(RParen);
		});

		this.hook = this.RULE("hook", () => {
			this.CONSUME(LeftSquareBracket);
			this.SUBRULE(this.passage);
			this.CONSUME(RightSquareBracket);
		});

		this.performSelfAnalysis();
	}
}

// Export a singleton instance of the parser.
// This is required for the visitor to be generated correctly.
export const parser = new HarloweParser();
