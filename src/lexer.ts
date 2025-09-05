import { createToken, Lexer, type TokenType } from "chevrotain";

// =================================================================
// Token Definitions
// =================================================================

export const allTokens: TokenType[] = [];
const addToken = (token: TokenType) => allTokens.push(token);

// --- Category 5: Identifiers ---
// This is defined early because the createKeyword helper depends on it.
export const Identifier = createToken({
	name: "Identifier",
	pattern: /[_a-zA-Z][_a-zA-Z0-9]*/,
});

// This helper is used for all keywords to ensure they are prioritized over the generic Identifier token.
const createKeyword = (config: { name: string; pattern: RegExp }) =>
	createToken({ ...config, longer_alt: Identifier });

// --- Category 1: Whitespace & Comments ---
export const WhiteSpace = createToken({
	name: "WhiteSpace",
	pattern: /\s+/,
	group: Lexer.SKIPPED,
	line_breaks: true,
});
addToken(WhiteSpace);

export const HTMLComment = createToken({
	name: "HTMLComment",
	pattern: /<!--[\s\S]*?-->/,
});
addToken(HTMLComment);

// --- Verbatim (Backtick) Token ---
export const VerbatimBlock = createToken({
	name: "VerbatimBlock",
	pattern: (text: string, startOffset: number): RegExpExecArray | null => {
		const openSequenceMatch = /^`+/.exec(text.substring(startOffset));
		if (openSequenceMatch === null) {
			return null;
		}
		const backtickCount = openSequenceMatch[0].length;
		let searchOffset = startOffset + backtickCount;
		while (searchOffset < text.length) {
			const nextBacktickIndex = text.indexOf("`", searchOffset);
			if (nextBacktickIndex === -1) {
				return null;
			}
			const closeSequenceMatch = /^`+/.exec(text.substring(nextBacktickIndex));
			if (closeSequenceMatch === null) {
				searchOffset = nextBacktickIndex + 1;
				continue;
			}
			const potentialClosingSequence = closeSequenceMatch[0];
			if (potentialClosingSequence.length === backtickCount) {
				const endOfMatch = nextBacktickIndex + backtickCount;
				const fullMatchString = text.substring(startOffset, endOfMatch);
				const result = [fullMatchString] as unknown as RegExpExecArray;
				result.index = startOffset;
				result.input = text;
				return result;
			} else {
				searchOffset = nextBacktickIndex + potentialClosingSequence.length;
			}
		}
		return null;
	},
	line_breaks: true,
});
addToken(VerbatimBlock);

// --- Category 2: Punctuation & Delimiters ---
export const LinkArrowLeft = createToken({
	name: "LinkArrowLeft",
	pattern: /<-/,
});
addToken(LinkArrowLeft);
export const LinkArrowRight = createToken({
	name: "LinkArrowRight",
	pattern: /->/,
});
addToken(LinkArrowRight);
export const LeftDoubleSquareBracket = createToken({
	name: "LeftDoubleSquareBracket",
	pattern: /\[\[/,
});
addToken(LeftDoubleSquareBracket);
export const RightDoubleSquareBracket = createToken({
	name: "RightDoubleSquareBracket",
	pattern: /\]\]/,
});
addToken(RightDoubleSquareBracket);
export const UnclosedHook = createToken({
	name: "UnclosedHook",
	pattern: /\[=+/,
});
addToken(UnclosedHook);
export const LeftSquareBracket = createToken({
	name: "LeftSquareBracket",
	pattern: /\[/,
});
addToken(LeftSquareBracket);
export const RightSquareBracket = createToken({
	name: "RightSquareBracket",
	pattern: /\]/,
});
addToken(RightSquareBracket);
export const UnclosedCurly = createToken({
	name: "UnclosedCurly",
	pattern: /\{=+/,
});
addToken(UnclosedCurly);
export const LeftCurlyBracket = createToken({
	name: "LeftCurlyBracket",
	pattern: /\{/,
});
addToken(LeftCurlyBracket);
export const RightCurlyBracket = createToken({
	name: "RightCurlyBracket",
	pattern: /\}/,
});
addToken(RightCurlyBracket);
export const Spread = createToken({ name: "Spread", pattern: /\.\.\./ });
addToken(Spread);
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
addToken(LParen);
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
addToken(RParen);
export const Colon = createToken({ name: "Colon", pattern: /:/ });
addToken(Colon);
export const Comma = createToken({ name: "Comma", pattern: /,/ });
addToken(Comma);
export const Pipe = createToken({ name: "Pipe", pattern: /\|/ });
addToken(Pipe);
export const LessThan = createToken({ name: "LessThan", pattern: /</ });
addToken(LessThan);
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
addToken(GreaterThan);
export const QuestionMark = createToken({
	name: "QuestionMark",
	pattern: /\?/,
});
addToken(QuestionMark);
export const Dollar = createToken({ name: "Dollar", pattern: /\$/ });
addToken(Dollar);
export const Backslash = createToken({ name: "Backslash", pattern: /\\/ });
addToken(Backslash);

export const BulletedListMarker = createToken({
	name: "BulletedListMarker",
	// Use a function pattern to enforce start-of-line without anchors
	pattern: (text: string, startOffset: number): RegExpExecArray | null => {
		// Must start with '*'
		if (text.charAt(startOffset) !== "*") return null;
		// Ensure previous character is start of input or a newline
		if (startOffset > 0) {
			const prev = text.charAt(startOffset - 1);
			if (prev !== "\n" && prev !== "\r") return null;
		}
		const m = /^\*+(?=\s)/.exec(text.substring(startOffset));
		if (!m) return null;
		const result = [m[0]] as unknown as RegExpExecArray;
		result.index = startOffset;
		result.input = text;
		return result;
	},
	line_breaks: false,
});
addToken(BulletedListMarker);
export const NumberedListMarker = createToken({
	name: "NumberedListMarker",
	pattern: (text: string, startOffset: number): RegExpExecArray | null => {
		// Must start with a digit
		const ch = text.charAt(startOffset);
		if (ch < "0" || ch > "9") return null;
		if (startOffset > 0) {
			const prev = text.charAt(startOffset - 1);
			if (prev !== "\n" && prev !== "\r") return null;
		}
		const m = /^\d+\.(?=\s)/.exec(text.substring(startOffset));
		if (!m) return null;
		const result = [m[0]] as unknown as RegExpExecArray;
		result.index = startOffset;
		result.input = text;
		return result;
	},
	line_breaks: false,
});
addToken(NumberedListMarker);
// --- Category 6: Markup ---
export const Italic = createToken({ name: "Italic", pattern: /\/\// });
addToken(Italic);
export const Bold = createToken({ name: "Bold", pattern: /''/ });
addToken(Bold);
export const Strikethrough = createToken({
	name: "Strikethrough",
	pattern: /~~/,
});
addToken(Strikethrough);
export const Emphasis = createToken({ name: "Emphasis", pattern: /\*\*/ });
addToken(Emphasis);
export const Superscript = createToken({
	name: "Superscript",
	pattern: /\^\^/,
});
addToken(Superscript);
export const HeadingMarker = createToken({
	name: "HeadingMarker",
	pattern: /#{1,6}(?=\s)/,
});
addToken(HeadingMarker);
export const HorizontalRule = createToken({
	name: "HorizontalRule",
	pattern: /---+\s*/,
});
addToken(HorizontalRule);
export const Aligner = createToken({ name: "Aligner", pattern: /<*={2,}>*/ });
addToken(Aligner);
export const ColumnMarker = createToken({
	name: "ColumnMarker",
	pattern: /=*\|.*\|=*/,
});
addToken(ColumnMarker);

// --- Category 2a: Arithmetic Operators ---
export const Plus = createToken({ name: "Plus", pattern: /\+/ });
addToken(Plus);
// TypeSuffix must be defined before Minus to be matched correctly.
export const TypeSuffix = createKeyword({
	name: "TypeSuffix",
	pattern: /-type/i,
});
addToken(TypeSuffix);
export const Minus = createToken({ name: "Minus", pattern: /-/ });
addToken(Minus);
export const Multiply = createToken({ name: "Multiply", pattern: /\*/ });
addToken(Multiply);
export const Divide = createToken({ name: "Divide", pattern: /\// });
addToken(Divide);
export const Modulo = createToken({ name: "Modulo", pattern: /%/ });
addToken(Modulo);

// --- Category 4: Keywords ---

export const TwoBind = createToken({ name: "TwoBind", pattern: /2bind/i });
addToken(TwoBind);
export const Its = createKeyword({ name: "Its", pattern: /its/i });
addToken(Its);
export const It = createKeyword({ name: "It", pattern: /it/i });
addToken(It);
export const Turns = createKeyword({ name: "Turns", pattern: /turns|turn/i });
addToken(Turns);
export const Visits = createKeyword({
	name: "Visits",
	pattern: /visits|visit/i,
});
addToken(Visits);
export const Exits = createKeyword({ name: "Exits", pattern: /exits|exit/i });
addToken(Exits);
export const To = createKeyword({ name: "To", pattern: /to/i });
addToken(To);
export const Into = createKeyword({ name: "Into", pattern: /into/i });
addToken(Into);
export const And = createKeyword({ name: "And", pattern: /and/i });
addToken(And);
export const Or = createKeyword({ name: "Or", pattern: /or/i });
addToken(Or);
export const Not = createKeyword({ name: "Not", pattern: /not/i });
addToken(Not);
export const Is = createKeyword({ name: "Is", pattern: /is/i });
addToken(Is);
export const In = createKeyword({ name: "In", pattern: /in/i });
addToken(In);
export const Contains = createKeyword({
	name: "Contains",
	pattern: /contains/i,
});
addToken(Contains);
export const Matches = createKeyword({ name: "Matches", pattern: /matches/i });
addToken(Matches);
export const Bind = createKeyword({ name: "Bind", pattern: /bind/i });
addToken(Bind);
export const Where = createKeyword({ name: "Where", pattern: /where/i });
addToken(Where);
export const When = createKeyword({ name: "When", pattern: /when/i });
addToken(When);
export const Via = createKeyword({ name: "Via", pattern: /via/i });
addToken(Via);
export const Making = createKeyword({ name: "Making", pattern: /making/i });
addToken(Making);
export const Each = createKeyword({ name: "Each", pattern: /each/i });
addToken(Each);
export const Pos = createKeyword({ name: "Pos", pattern: /pos/i });
addToken(Pos);
export const Time = createKeyword({ name: "Time", pattern: /time/i });
addToken(Time);
export const NumberType = createKeyword({
	name: "NumberType",
	pattern: /number/i,
});
addToken(NumberType);
export const StringType = createKeyword({
	name: "StringType",
	pattern: /string/i,
});
addToken(StringType);
export const BooleanType = createKeyword({
	name: "BooleanType",
	pattern: /boolean/i,
});
addToken(BooleanType);
export const ArrayType = createKeyword({
	name: "ArrayType",
	pattern: /array/i,
});
addToken(ArrayType);
export const DatamapType = createKeyword({
	name: "DatamapType",
	pattern: /datamap/i,
});
addToken(DatamapType);
export const DatasetType = createKeyword({
	name: "DatasetType",
	pattern: /dataset/i,
});
addToken(DatasetType);
export const CommandType = createKeyword({
	name: "CommandType",
	pattern: /command/i,
});
addToken(CommandType);
export const ChangerType = createKeyword({
	name: "ChangerType",
	pattern: /changer/i,
});
addToken(ChangerType);
export const ColourType = createKeyword({
	name: "ColourType",
	pattern: /colour|color/i,
});
addToken(ColourType);
export const GradientType = createKeyword({
	name: "GradientType",
	pattern: /gradient/i,
});
addToken(GradientType);
export const LambdaType = createKeyword({
	name: "LambdaType",
	pattern: /lambda/i,
});
addToken(LambdaType);
export const MacroType = createKeyword({
	name: "MacroType",
	pattern: /macro/i,
});
addToken(MacroType);
export const DatatypeType = createKeyword({
	name: "DatatypeType",
	pattern: /datatype/i,
});
addToken(DatatypeType);
export const CodehookType = createKeyword({
	name: "CodehookType",
	pattern: /codehook/i,
});
addToken(CodehookType);
export const AnyType = createKeyword({ name: "AnyType", pattern: /any/i });
addToken(AnyType);
export const ConstType = createKeyword({
	name: "ConstType",
	pattern: /const/i,
});
addToken(ConstType);

// --- Category 3: Literals ---
export const StringLiteral = createToken({
	name: "StringLiteral",
	pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
});
addToken(StringLiteral);
export const NumberLiteral = createToken({
	name: "NumberLiteral",
	pattern: /-?\d+(?:\.\d+)?(?:ms|s)?/,
});
addToken(NumberLiteral);
export const HexColorLiteral = createToken({
	name: "HexColorLiteral",
	pattern: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/,
});
addToken(HexColorLiteral);
export const BooleanLiteral = createToken({
	name: "BooleanLiteral",
	pattern: /true|false/i,
	longer_alt: Identifier,
});
addToken(BooleanLiteral);

addToken(Identifier);

// --- Error Token ---
export const ErrorToken = createToken({
	name: "ErrorToken",
	pattern: /./,
});
addToken(ErrorToken);

// --- Lexer Instance ---
export const HarloweLexer = new Lexer(allTokens, {
	positionTracking: "full",
});
