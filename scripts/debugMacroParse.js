// Quick debug helper: parse a macro input and print parser errors
import { HarloweLexer } from "../src/lexer.js";
import { HarloweParser } from "../src/parser.js";

function debug(input) {
    const lexResult = HarloweLexer.tokenize(input);
    const parser = new HarloweParser();
    parser.input = lexResult.tokens;
    const cst = parser.passage();
    console.log("INPUT:", input);
    console.log(
        "TOKENS:",
        lexResult.tokens.map((t) => ({ image: t.image, tokenType: t.tokenType && t.tokenType.name })),
    );
    console.log("ERRORS:", JSON.stringify(parser.errors, null, 2));
    console.log("CST:", !!cst);
}

// Example from tests
debug("(set: $a to 1 $b to 2)");
