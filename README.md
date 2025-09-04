# Harlowe Tokenizer & Parser (Early Development)

This project aims to provide a robust, type-safe tokenizer and parser for the [Harlowe](https://twine2.neocities.org/) story format, built in TypeScript using [Chevrotain](https://chevrotain.io/) and tested with [Vitest](https://vitest.dev/).

## Status

**Early Development:** Core architecture and initial tokenization rules are being implemented. Many features are incomplete or experimental.

## Goals

- Tokenize and parse all Harlowe syntax (macros, hooks, variables, links, comments, etc.)
- Strong TypeScript typing for tokens, AST nodes, and parser rules
- Accurate line/column tracking and error handling
- Extensible, maintainable, and fully tested codebase

## Stretch Goals

- How about a language server with a VSCode extension?  😉 A man can dream.

## Technologies

- **TypeScript** (strict mode)
- **Chevrotain** (lexer/parser)
- **Vite** (unit/integration tests)
- **Biome** (linting/formatting)

## Usage Example

```typescript
import { tokenizeHarlowe } from './src/tokenizer';

const source = 'Hello, (set: $var to 1)';
const tokens = tokenizeHarlowe(source);
// tokens: Array of HarloweToken objects
```

## Roadmap

- [x] Project scaffolding
- [ ] Basic tokenization (macros, variables, text)
- [ ] Initial parser rules
- [ ] AST structure
- [ ] Error handling
- [ ] Full grammar coverage
- [ ] Fuzzing and edge case tests

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. All code must be type-safe, documented, and tested.

## License

MIT

---

*This README will evolve as the parser matures. For questions or feedback, open an issue.*
