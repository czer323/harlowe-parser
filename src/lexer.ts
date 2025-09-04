// Harlowe Chevrotain Lexer
// This file implements the tokens for the Harlowe language based on the
// token reference and requirements.
import { createToken, Lexer, type TokenType } from "chevrotain";

// =================================================================
// Token Definitions
// =================================================================

export const allTokens: TokenType[] = [];
const addToken = (token: TokenType) => allTokens.push(token);

// --- Category 1: Whitespace & Comments ---
addToken(
	createToken({ name: "WhiteSpace", pattern: /\s+/, group: Lexer.SKIPPED }),
);
addToken(
	createToken({
		name: "HTMLComment",
		pattern: /<!--[\s\S]*?-->/,
		group: Lexer.SKIPPED,
	}),
);

// --- Verbatim (Backtick) Token ---
// This single token uses a custom pattern to match an entire verbatim block.
const VerbatimBlock = createToken({
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
				return null; // Unclosed verbatim block
			}

			const closeSequenceMatch = /^`+/.exec(text.substring(nextBacktickIndex));
			if (closeSequenceMatch === null) {
				// This should not happen based on the indexOf above, but as a safeguard:
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
addToken(createToken({ name: "LinkArrowLeft", pattern: /<-/ }));
addToken(createToken({ name: "LinkArrowRight", pattern: /->/ }));
addToken(createToken({ name: "LeftDoubleSquareBracket", pattern: /\[\[/ }));
addToken(createToken({ name: "RightDoubleSquareBracket", pattern: /\]\]/ }));
addToken(createToken({ name: "UnclosedHook", pattern: /\[=+/ }));
addToken(createToken({ name: "LeftSquareBracket", pattern: /\[/ }));
addToken(createToken({ name: "RightSquareBracket", pattern: /\]/ }));
addToken(createToken({ name: "UnclosedCurly", pattern: /\{=+/ }));
addToken(createToken({ name: "LeftCurlyBracket", pattern: /\{/ }));
addToken(createToken({ name: "RightCurlyBracket", pattern: /\}/ }));
addToken(createToken({ name: "Spread", pattern: /\.\.\./ }));
addToken(createToken({ name: "LParen", pattern: /\(/ }));
addToken(createToken({ name: "RParen", pattern: /\)/ }));
addToken(createToken({ name: "Colon", pattern: /:/ }));
addToken(createToken({ name: "Comma", pattern: /,/ }));
addToken(createToken({ name: "Pipe", pattern: /\|/ }));
addToken(createToken({ name: "LessThan", pattern: /</ }));
addToken(createToken({ name: "GreaterThan", pattern: />/ }));
addToken(createToken({ name: "QuestionMark", pattern: /\?/ }));
addToken(createToken({ name: "Dollar", pattern: /\$/ }));
addToken(createToken({ name: "Backslash", pattern: /\\/ }));

// --- Category 6: Markup ---
addToken(createToken({ name: "Italic", pattern: /\/\// }));
addToken(createToken({ name: "Bold", pattern: /''/ }));
addToken(createToken({ name: "Strikethrough", pattern: /~~/ }));
addToken(createToken({ name: "Emphasis", pattern: /\*\*/ }));
addToken(createToken({ name: "Superscript", pattern: /\^\^/ }));
addToken(createToken({ name: "BulletedListMarker", pattern: /\*+(?=\s)/ }));
addToken(
	createToken({ name: "NumberedListMarker", pattern: /(?:0\.)+(?=\s)/ }),
);
addToken(createToken({ name: "HeadingMarker", pattern: /#{1,6}(?=\s)/ }));
addToken(createToken({ name: "HorizontalRule", pattern: /---+\s*/ }));
addToken(createToken({ name: "Aligner", pattern: /<*={2,}>*/ }));
addToken(createToken({ name: "ColumnMarker", pattern: /=*\|.*\|=*/ }));

// --- Category 5: Identifiers ---
export const Identifier = createToken({
	name: "Identifier",
	pattern: /[_a-zA-Z][_a-zA-Z0-9]*/,
});

// --- Category 4: Keywords ---
const keyword = (config: { name: string; pattern: RegExp }) =>
	createToken({ ...config, longer_alt: Identifier });
addToken(createToken({ name: "TwoBind", pattern: /2bind/i }));
addToken(keyword({ name: "Its", pattern: /its/i }));
addToken(keyword({ name: "It", pattern: /it/i }));
addToken(keyword({ name: "Turns", pattern: /turns|turn/i }));
addToken(keyword({ name: "Visits", pattern: /visits|visit/i }));
addToken(keyword({ name: "Exits", pattern: /exits|exit/i }));
addToken(keyword({ name: "To", pattern: /to/i }));
addToken(keyword({ name: "Into", pattern: /into/i }));
addToken(keyword({ name: "And", pattern: /and/i }));
addToken(keyword({ name: "Or", pattern: /or/i }));
addToken(keyword({ name: "Not", pattern: /not/i }));
addToken(keyword({ name: "Is", pattern: /is/i }));
addToken(keyword({ name: "In", pattern: /in/i }));
addToken(keyword({ name: "Contains", pattern: /contains/i }));
addToken(keyword({ name: "Matches", pattern: /matches/i }));
addToken(keyword({ name: "Bind", pattern: /bind/i }));
addToken(keyword({ name: "Where", pattern: /where/i }));
addToken(keyword({ name: "When", pattern: /when/i }));
addToken(keyword({ name: "Via", pattern: /via/i }));
addToken(keyword({ name: "Making", pattern: /making/i }));
addToken(keyword({ name: "Each", pattern: /each/i }));
addToken(keyword({ name: "Pos", pattern: /pos/i }));
addToken(keyword({ name: "Time", pattern: /time/i }));
addToken(keyword({ name: "TypeSuffix", pattern: /-type/i }));
addToken(keyword({ name: "NumberType", pattern: /number/i }));
addToken(keyword({ name: "StringType", pattern: /string/i }));
addToken(keyword({ name: "BooleanType", pattern: /boolean/i }));
addToken(keyword({ name: "ArrayType", pattern: /array/i }));
addToken(keyword({ name: "DatamapType", pattern: /datamap/i }));
addToken(keyword({ name: "DatasetType", pattern: /dataset/i }));
addToken(keyword({ name: "CommandType", pattern: /command/i }));
addToken(keyword({ name: "ChangerType", pattern: /changer/i }));
addToken(keyword({ name: "ColourType", pattern: /colour|color/i }));
addToken(keyword({ name: "GradientType", pattern: /gradient/i }));
addToken(keyword({ name: "LambdaType", pattern: /lambda/i }));
addToken(keyword({ name: "MacroType", pattern: /macro/i }));
addToken(keyword({ name: "DatatypeType", pattern: /datatype/i }));
addToken(keyword({ name: "CodehookType", pattern: /codehook/i }));
addToken(keyword({ name: "AnyType", pattern: /any/i }));
addToken(keyword({ name: "ConstType", pattern: /const/i }));

// --- Category 3: Literals ---
addToken(
	createToken({
		name: "StringLiteral",
		pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/,
	}),
);
addToken(
	createToken({ name: "NumberLiteral", pattern: /-?\d+(?:\.\d+)?(?:ms|s)?/ }),
);
addToken(
	createToken({
		name: "HexColorLiteral",
		pattern: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/,
	}),
);
addToken(
	createToken({
		name: "BooleanLiteral",
		pattern: /true|false/i,
		longer_alt: Identifier,
	}),
);

addToken(Identifier);

// --- PlainText and Error Tokens ---
// PlainText should be one of the last tokens, to catch what's left.
const PlainText = createToken({
	name: "PlainText",
	pattern: /[^[\](){}|<>?$\\:',"`#*~/^-]+/,
});
addToken(PlainText);

// ErrorToken must be last.
const ErrorToken = createToken({
	name: "ErrorToken",
	pattern: /./,
});
addToken(ErrorToken);

// --- Lexer Instance ---
export const HarloweLexer = new Lexer(allTokens, {
	positionTracking: "full",
});
