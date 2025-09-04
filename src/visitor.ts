import { parser } from "./parser.js";

// The parser instance from Chevrotain contains a method to generate a base visitor class.
// By extending this base class, we get type-safe visitor methods for each rule in our grammar.
const BaseHarloweVisitor = parser.getBaseCstVisitorConstructor();

/**
 * The CstVisitor class is the foundation for all tools that need to process the
 * Concrete Syntax Tree (CST). It implements the Visitor design pattern.
 *
 * To use it, create a new class that extends this one and override the methods
 * for the grammar rules you want to handle.
 *
 * For example, to create an AST converter:
 * class AstConverter extends CstVisitor {
 *   constructor() {
 *     super();
 *     this.validateVisitor();
 *   }
 *
 *   macroCall(ctx) {
 *     // Logic to convert a macroCall CST node to an AST node
 *     const name = ctx.Identifier[0].image;
 *     const args = ctx.expression?.map(e => this.visit(e)) || [];
 *     return { type: "MacroCall", name, args };
 *   }
 * }
 */
export class CstVisitor extends BaseHarloweVisitor {
	// This class is empty because it is a base class.
	// Subclasses should override the specific visitor methods they need.
	// The constructor is not needed because the super constructor is empty.
}
