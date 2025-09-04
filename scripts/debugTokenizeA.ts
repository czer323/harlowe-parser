// Debug script to print the token stream for a.twee (TypeScript)
import fs from "fs";
import path from "path";
import { HarloweLexer } from "../src/lexer.js";

const filePath = path.resolve(
  "../Example Harlowe Passages/a.twee"
);
const content = fs.readFileSync(filePath, "utf8");
const lexResult = HarloweLexer.tokenize(content);

console.log("TOKENS:");

import type { IToken } from "chevrotain";
lexResult.tokens.forEach((tok: IToken, i: number) => {
  console.log(
    `${i}: ${tok.tokenType.name} [${JSON.stringify(tok.image)}] (line ${tok.startLine}, col ${tok.startColumn})`
  );
});

if (lexResult.errors.length > 0) {
  console.log("LEXER ERRORS:");
  lexResult.errors.forEach((e: any) => console.log(e));
}
