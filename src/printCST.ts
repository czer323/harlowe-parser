// Utility for pretty-printing Chevrotain CST/AST for debugging
import type { CstNode, IToken } from "chevrotain";

/**
 * Pretty-print a Chevrotain CST or AST node for debugging.
 * @param node - CST or AST node
 * @param indent - Indentation level (default: 0)
 * @returns Formatted string
 */
export function printCST(
	node: CstNode | IToken | undefined,
	indent = 0,
): string {
	if (!node) return "<empty>";
	const pad = "  ".repeat(indent);
	// If this is a token (IToken), print its image and token type
	if ((node as IToken).image !== undefined) {
		const token = node as IToken;
		return `${pad}[${token.tokenType?.name || "Token"}] '${token.image}'`;
	}
	// Otherwise, it's a CST node
	let out = `${pad}${(node as CstNode).name}`;
	if ((node as CstNode).children) {
		for (const value of Object.values((node as CstNode).children)) {
			if (Array.isArray(value)) {
				for (const child of value) {
					out += `\n${printCST(child as CstNode | IToken, indent + 1)}`;
				}
			} else if (value && typeof value === "object") {
				out += `\n${printCST(value as CstNode | IToken, indent + 1)}`;
			}
		}
	}
	return out;
}
