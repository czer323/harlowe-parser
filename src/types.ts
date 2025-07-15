/**
 * Represents a Harlowe passage, including its name, content, and AST.
 */
export interface HarlowePassage {
	/** Passage name (from the :: header) */
	name: string;
	/** Raw passage content (excluding header) */
	content: string;
	/** Parsed AST for the passage body */
	ast: PassageBodyNode[];
	/** Passage tags (optional, for future use) */
	tags?: string[];
	/** Line/column where the passage starts */
	location: SourceLocation;
}

/**
 * Source location for line/column tracking.
 */
export interface SourceLocation {
	line: number;
	column: number;
}

/**
 * Base AST node type for all passage body elements.
 */
export interface BaseNode {
	type: string;
	location: SourceLocation;
	/** Original text for error recovery or formatting */
	raw?: string;
	/** Optional error message if this node represents a recovery/error */
	error?: string;
}

/**
 * AST node for a macro call, e.g., (set: ...)
 */
export interface MacroCallNode extends BaseNode {
	type: "MacroCall";
	name: string;
	args: ASTNode[];
}

/**
 * AST node for a variable, e.g., $battlecry
 */
export interface VariableNode extends BaseNode {
	type: "Variable";
	name: string;
}

/**
 * AST node for a string literal, e.g., "Save a "
 */
export interface StringLiteralNode extends BaseNode {
	type: "StringLiteral";
	value: string;
}

/**
 * AST node for an operator, e.g., +, to
 */
export interface OperatorNode extends BaseNode {
	type: "Operator";
	operator: string;
}

/**
 * AST node for plain text (non-macro content)
 */
export interface PlainTextNode extends BaseNode {
	type: "PlainText";
	value: string;
}

/**
 * AST node for the passage header (:: name)
 */
export interface PassageHeaderNode extends BaseNode {
	type: "PassageHeader";
	name: string;
	tags?: string[];
}

/**
 * AST node for error recovery (unparsed or invalid content)
 */
export interface ErrorNode extends BaseNode {
	type: "Error";
	message: string;
}

/**
 * Union type for all AST nodes.
 */
export type ASTNode =
	| MacroCallNode
	| VariableNode
	| StringLiteralNode
	| OperatorNode
	| PlainTextNode
	| PassageHeaderNode
	| ErrorNode;

/**
 * Alias for the top-level passage body node array.
 */
export type PassageBodyNode = ASTNode;
