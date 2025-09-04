import type { CstNode, IToken } from "chevrotain";
import type {
	And,
	Contains,
	Divide,
	GreaterThan,
	Is,
	LessThan,
	Matches,
	Minus,
	Modulo,
	Multiply,
	Or,
	Plus,
} from "./lexer.js";

// --- Top Level ---

export type PassageCstChildren = {
	passageContent?: PassageContentCstNode[];
};
export interface PassageCstNode extends CstNode {
	name: "passage";
	children: PassageCstChildren;
}

export type PassageContentCstChildren = {
	link?: LinkCstNode[];
	verbatim?: VerbatimCstNode[];
	styledText?: StyledTextCstNode[];
	heading?: HeadingCstNode[];
	list?: ListCstNode[];
	horizontalRule?: HorizontalRuleCstNode[];
	macroCall?: MacroCallCstNode[];
	hook?: HookCstNode[];
	proseToken?: ProseTokenCstNode[];
};
export interface PassageContentCstNode extends CstNode {
	name: "passageContent";
	children: PassageContentCstChildren;
}

export type ProseTokenCstChildren = {
	Identifier?: IToken[];
	WhiteSpace?: IToken[];
	HTMLComment?: IToken[];
	NumberLiteral?: IToken[];
	StringLiteral?: IToken[];
	BooleanLiteral?: IToken[];
	And?: IToken[];
	Or?: IToken[];
	Not?: IToken[];
	Is?: IToken[];
	In?: IToken[];
	Contains?: IToken[];
	Matches?: IToken[];
	To?: IToken[];
	Into?: IToken[];
	Where?: IToken[];
	Bind?: IToken[];
	Each?: IToken[];
	It?: IToken[];
	Its?: IToken[];
	Colon?: IToken[];
	Comma?: IToken[];
	Pipe?: IToken[];
	GreaterThan?: IToken[];
	LessThan?: IToken[];
	QuestionMark?: IToken[];
	Dollar?: IToken[];
	RParen?: IToken[];
	RightSquareBracket?: IToken[];
	RightCurlyBracket?: IToken[];
	LeftCurlyBracket?: IToken[];
	RightDoubleSquareBracket?: IToken[];
	LinkArrowLeft?: IToken[];
	LinkArrowRight?: IToken[];
	Spread?: IToken[];
	ErrorToken?: IToken[];
};
export interface ProseTokenCstNode extends CstNode {
	name: "proseToken";
	children: ProseTokenCstChildren;
}

// --- Standalone Constructs ---

export type LinkCstChildren = {
	LeftDoubleSquareBracket: IToken[];
	passage: PassageCstNode[];
	RightDoubleSquareBracket: IToken[];
};
export interface LinkCstNode extends CstNode {
	name: "link";
	children: LinkCstChildren;
}

export type VerbatimCstChildren = {
	VerbatimBlock: IToken[];
};
export interface VerbatimCstNode extends CstNode {
	name: "verbatim";
	children: VerbatimCstChildren;
}

export type StyledTextCstChildren = {
	Italic?: IToken[];
	passage?: PassageCstNode[];
	Bold?: IToken[];
	passage2?: PassageCstNode[];
	Strikethrough?: IToken[];
	passage3?: PassageCstNode[];
	Superscript?: IToken[];
	passage4?: PassageCstNode[];
	Emphasis?: IToken[];
	passage5?: PassageCstNode[];
};
export interface StyledTextCstNode extends CstNode {
	name: "styledText";
	children: StyledTextCstChildren;
}

export type HeadingCstChildren = {
	HeadingMarker: IToken[];
};
export interface HeadingCstNode extends CstNode {
	name: "heading";
	children: HeadingCstChildren;
}

export type ListCstChildren = {
	BulletedListMarker?: IToken[];
	NumberedListMarker?: IToken[];
};
export interface ListCstNode extends CstNode {
	name: "list";
	children: ListCstChildren;
}

export type HorizontalRuleCstChildren = {
	HorizontalRule: IToken[];
};
export interface HorizontalRuleCstNode extends CstNode {
	name: "horizontalRule";
	children: HorizontalRuleCstChildren;
}

export type HookCstChildren = {
	LeftSquareBracket: IToken[];
	passage: PassageCstNode[];
	RightSquareBracket: IToken[];
};
export interface HookCstNode extends CstNode {
	name: "hook";
	children: HookCstChildren;
}

// --- Macro & Variable ---

export type MacroCallCstChildren = {
	LParen: IToken[];
	Identifier: IToken[];
	Colon?: IToken[];
	expression?: ExpressionCstNode[];
	RParen: IToken[];
};
export interface MacroCallCstNode extends CstNode {
	name: "macroCall";
	children: MacroCallCstChildren;
}

export type VariableCstChildren = {
	Dollar: IToken[];
	Identifier: IToken[];
};
export interface VariableCstNode extends CstNode {
	name: "variable";
	children: VariableCstChildren;
}

// --- Expressions ---

export type ExpressionCstChildren = {
	logicalExpression: LogicalExpressionCstNode[];
};
export interface ExpressionCstNode extends CstNode {
	name: "expression";
	children: ExpressionCstChildren;
}

export type LogicalExpressionCstChildren = {
	lhs: ComparisonExpressionCstNode[];
	operator?: (IToken & { tokenType: typeof And | typeof Or })[];
	rhs?: ComparisonExpressionCstNode[];
};
export interface LogicalExpressionCstNode extends CstNode {
	name: "logicalExpression";
	children: LogicalExpressionCstChildren;
}

export type ComparisonExpressionCstChildren = {
	lhs: AdditiveExpressionCstNode[];
	operator?: (
		| IToken & {
				tokenType:
					| typeof Is
					| typeof Contains
					| typeof Matches
					| typeof GreaterThan
					| typeof LessThan;
		  }
	)[];
	rhs?: AdditiveExpressionCstNode[];
};
export interface ComparisonExpressionCstNode extends CstNode {
	name: "comparisonExpression";
	children: ComparisonExpressionCstChildren;
}

export type AdditiveExpressionCstChildren = {
	lhs: MultiplicativeExpressionCstNode[];
	operator?: (IToken & { tokenType: typeof Plus | typeof Minus })[];
	rhs?: MultiplicativeExpressionCstNode[];
};
export interface AdditiveExpressionCstNode extends CstNode {
	name: "additiveExpression";
	children: AdditiveExpressionCstChildren;
}

export type MultiplicativeExpressionCstChildren = {
	lhs: UnaryExpressionCstNode[];
	operator?: (
		| IToken & { tokenType: typeof Multiply | typeof Divide | typeof Modulo }
	)[];
	rhs?: UnaryExpressionCstNode[];
};
export interface MultiplicativeExpressionCstNode extends CstNode {
	name: "multiplicativeExpression";
	children: MultiplicativeExpressionCstChildren;
}

export type UnaryExpressionCstChildren = {
	Not?: IToken[];
	Minus?: IToken[];
	unaryExpression?: UnaryExpressionCstNode[];
	primaryExpression?: PrimaryExpressionCstNode[];
};
export interface UnaryExpressionCstNode extends CstNode {
	name: "unaryExpression";
	children: UnaryExpressionCstChildren;
}

export type PrimaryExpressionCstChildren = {
	NumberLiteral?: IToken[];
	StringLiteral?: IToken[];
	BooleanLiteral?: IToken[];
	variable?: VariableCstNode[];
	macroCall?: MacroCallCstNode[];
	LParen?: IToken[];
	expression?: ExpressionCstNode[];
	RParen?: IToken[];
};
export interface PrimaryExpressionCstNode extends CstNode {
	name: "primaryExpression";
	children: PrimaryExpressionCstChildren;
}
