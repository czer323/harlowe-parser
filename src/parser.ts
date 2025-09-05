// Harlowe Chevrotain Parser (minimal foundation)
// Follows Chevrotain best practices for CST output and extensibility

// Minimal CST parser for Harlowe passages

import * as chevrotain from "chevrotain";
import {
	And,
	// Full token list
	allTokens,
	Bind,
	Bold,
	BooleanLiteral,
	// BulletedListMarker, // This will be used when the 'list' rule is restored.
	Colon,
	Comma,
	Contains,
	Divide,
	Dollar,
	Each,
	Emphasis,
	ErrorToken,
	GreaterThan,
	HeadingMarker,
	HorizontalRule,
	HTMLComment,
	Identifier,
	In,
	Into,
	Is,
	It,
	Italic,
	Its,
	LeftCurlyBracket,
	LeftDoubleSquareBracket,
	LeftSquareBracket,
	LessThan,
	LinkArrowLeft,
	LinkArrowRight,
	LParen,
	Matches,
	Minus,
	Modulo,
	Multiply,
	Not,
	NumberLiteral,
	Or,
	Pipe,
	Plus,
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
	VerbatimBlock,
	Where,
	WhiteSpace,
} from "./lexer.js";

export class HarloweParser extends chevrotain.CstParser {
	// Top-level passage rule
	public passage!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	// Rule to dispatch to various content types (macros, hooks, prose)
	public passageContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	// Rule to consume a single token of prose
	public proseToken!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public linkProseToken!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public bracketPair!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public macroCall!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public hook!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public hookContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public link!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public styledText!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public linkContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public italicContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public boldContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public strikethroughContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public superscriptContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public emphasisContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public hookInline!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public passageInline!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
	public passageInlineContent!: chevrotain.ParserMethod<[], chevrotain.CstNode>;
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
				// RightDoubleSquareBracket is intentionally excluded here to prevent parsing ambiguity:
				// Including it could cause the parser to prematurely terminate a link or confuse the boundaries
				// of nested links. Instead, use linkProseToken inside links to safely handle link content.
				{ ALT: () => this.CONSUME(LinkArrowLeft) },
				{ ALT: () => this.CONSUME(LinkArrowRight) },
				{ ALT: () => this.CONSUME(Spread) },
				{ ALT: () => this.CONSUME(ErrorToken) },
			]);
		});

		// Link-specific prose token: like proseToken but does not consume the closing RightDoubleSquareBracket
		this.linkProseToken = this.RULE("linkProseToken", () => {
			this.OR([
				{ ALT: () => this.CONSUME(Identifier) },
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
				{ ALT: () => this.CONSUME(LinkArrowLeft) },
				{ ALT: () => this.CONSUME(LinkArrowRight) },
				{ ALT: () => this.CONSUME(Spread) },
				{ ALT: () => this.CONSUME(ErrorToken) },
			]);
		});

		this.link = this.RULE("link", () => {
			this.CONSUME(LeftDoubleSquareBracket);
			this.SUBRULE(this.linkContent);
			this.CONSUME(RightDoubleSquareBracket);
		});

		// Restrict link content to inline-safe prose and styled text only (no nested links/macros)
		this.linkContent = this.RULE("linkContent", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.styledText) },
					{ ALT: () => this.SUBRULE(this.bracketPair) },
					// Explicitly consume link-safe tokens here to avoid SUBRULE prefix ambiguity
					{ ALT: () => this.CONSUME(Identifier) },
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
					{ ALT: () => this.CONSUME(LinkArrowLeft) },
					{ ALT: () => this.CONSUME(LinkArrowRight) },
					{ ALT: () => this.CONSUME(Spread) },
					{ ALT: () => this.CONSUME(ErrorToken) },
				]);
			});
		});

		this.verbatim = this.RULE("verbatim", () => {
			this.CONSUME(VerbatimBlock);
		});

		// Inline-limited passage used for link text and styled content to avoid full passage recursion
		this.passageInline = this.RULE("passageInline", () => {
			this.MANY(() => {
				this.SUBRULE(this.passageInlineContent);
			});
		});

		this.passageInlineContent = this.RULE("passageInlineContent", () => {
			this.OR([
				{ ALT: () => this.SUBRULE(this.link) },
				{ ALT: () => this.SUBRULE(this.verbatim) },
				{ ALT: () => this.SUBRULE(this.macroCall) },
				{ ALT: () => this.SUBRULE(this.hookInline) },
				{ ALT: () => this.SUBRULE(this.proseToken) },
			]);
		});

		// Inline-only hook variant: allows a hook but restricts its contents to inline elements
		this.hookInline = this.RULE("hookInline", () => {
			this.CONSUME(LeftSquareBracket);
			this.SUBRULE(this.passageInline);
			this.CONSUME(RightSquareBracket);
		});

		// Per-marker content rules: disallow nesting the same marker while permitting inline constructs
		this.italicContent = this.RULE("italicContent", () => {
			this.MANY(() => {
				this.OR([
					// Allow bracketed inline content as a single, factored alternative
					{ ALT: () => this.SUBRULE(this.bracketPair) },
					// Full `link` parsing is intentionally excluded here to avoid
					// ambiguity with `bracketPair`. Bracketed inline content is
					// handled by `bracketPair` above.
					{ ALT: () => this.SUBRULE(this.verbatim) },
					{ ALT: () => this.SUBRULE(this.macroCall) },
					// Do NOT allow generic nested styledText here to avoid consuming
					// the outer marker's closing token. Nested styling of the same
					// marker is disallowed by design. Other markers can be added
					// explicitly if needed (e.g. boldContent, strikethroughContent).
					{ ALT: () => this.SUBRULE(this.proseToken) },
				]);
			});
		});

		// Dedicated rule for handling bracketed inline content like [[...]]
		this.bracketPair = this.RULE("bracketPair", () => {
			this.CONSUME(LeftDoubleSquareBracket);
			// Allow zero-or-more link-safe tokens inside the bracket pair
			this.MANY(() => {
				this.SUBRULE(this.linkProseToken);
			});
			this.CONSUME(RightDoubleSquareBracket);
		});

		this.boldContent = this.RULE("boldContent", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.link) },
					{ ALT: () => this.SUBRULE(this.verbatim) },
					{ ALT: () => this.SUBRULE(this.macroCall) },
					{ ALT: () => this.SUBRULE(this.styledText) },
					{ ALT: () => this.SUBRULE(this.proseToken) },
				]);
			});
		});

		this.strikethroughContent = this.RULE("strikethroughContent", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.link) },
					{ ALT: () => this.SUBRULE(this.verbatim) },
					{ ALT: () => this.SUBRULE(this.macroCall) },
					{ ALT: () => this.SUBRULE(this.styledText) },
					{ ALT: () => this.SUBRULE(this.proseToken) },
				]);
			});
		});

		this.superscriptContent = this.RULE("superscriptContent", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.link) },
					{ ALT: () => this.SUBRULE(this.verbatim) },
					{ ALT: () => this.SUBRULE(this.macroCall) },
					{ ALT: () => this.SUBRULE(this.styledText) },
					{ ALT: () => this.SUBRULE(this.proseToken) },
				]);
			});
		});

		this.emphasisContent = this.RULE("emphasisContent", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.link) },
					{ ALT: () => this.SUBRULE(this.verbatim) },
					{ ALT: () => this.SUBRULE(this.macroCall) },
					{ ALT: () => this.SUBRULE(this.styledText) },
					{ ALT: () => this.SUBRULE(this.proseToken) },
				]);
			});
		});

		this.styledText = this.RULE("styledText", () => {
			this.OR([
				{
					ALT: () => {
						this.CONSUME(Italic);
						this.SUBRULE(this.italicContent);
						this.CONSUME2(Italic);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Bold);
						this.SUBRULE2(this.boldContent);
						this.CONSUME2(Bold);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Strikethrough);
						this.SUBRULE3(this.strikethroughContent);
						this.CONSUME2(Strikethrough);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Superscript);
						this.SUBRULE4(this.superscriptContent);
						this.CONSUME2(Superscript);
					},
				},
				{
					ALT: () => {
						this.CONSUME(Emphasis);
						this.SUBRULE5(this.emphasisContent);
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
				// Parse comma-separated expression arguments
				this.AT_LEAST_ONE_SEP({
					SEP: Comma,
					DEF: () => {
						// Allow either a variable assignment pattern "$x to expr" or a plain expression
						this.OR([
							{
								ALT: () => {
									this.SUBRULE(this.variable);
									this.CONSUME(To);
									this.SUBRULE2(this.expression);
								},
							},
							{ ALT: () => this.SUBRULE3(this.expression) },
						]);
					},
				});
			});
			this.CONSUME(RParen);
		});

		// Restrict hook contents to inline constructs and macro calls to avoid full-passage recursion
		this.hookContent = this.RULE("hookContent", () => {
			this.MANY(() => {
				this.OR([
					{ ALT: () => this.SUBRULE(this.link) },
					{ ALT: () => this.SUBRULE(this.verbatim) },
					{ ALT: () => this.SUBRULE(this.styledText) },
					{ ALT: () => this.SUBRULE(this.macroCall) },
					{ ALT: () => this.SUBRULE(this.proseToken) },
				]);
			});
		});

		this.hook = this.RULE("hook", () => {
			this.CONSUME(LeftSquareBracket);
			this.SUBRULE(this.hookContent);
			this.CONSUME(RightSquareBracket);
		});

		this.performSelfAnalysis();
	}
}

// Export a singleton instance of the parser.
// This is required for the visitor to be generated correctly.
export const parser = new HarloweParser();
