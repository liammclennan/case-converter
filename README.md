# Case Converter

[![Tests](https://github.com/liammclennan/case-converter/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/liammclennan/case-converter/actions/workflows/tests.yml)

A terminal program for converting whitespace-separated phrases to camel, Pascal,
or snake case. Requires Node.js 24 or later.

```sh
npm install
node index.js --help
node index.js --to camel "The quick brown fox"
# theQuickBrownFox
node index.js --to pascal "The quick brown fox"
# TheQuickBrownFox
node index.js --to snake "The quick brown fox"
# the_quick_brown_fox
```

Running without arguments also prints help. Quote the input as a single argument.
To convert a phrase starting with a hyphen, put `--` before it.

Words are separated by whitespace, including tabs, line breaks, and Unicode
whitespace. Leading, trailing, and repeated whitespace is discarded. Empty or
whitespace-only input produces an empty line. Camel case lowercases the entire
first word and capitalizes subsequent initials; Pascal case capitalizes every
initial. Other letters retain their original case. Snake case lowercases every
word and inserts underscores. Punctuation is preserved.

## Usage 

```
Usage: case-converter --to <camel|pascal|snake> "phrase"

Convert a whitespace-separated phrase into a cased string.

Options:
  --to <format>  Required target format: camel, pascal, or snake.
  --help, -h     Show this help message.

Examples:
  case-converter --to camel "The quick brown fox"
  case-converter --to pascal "The quick brown fox"
  case-converter --to snake "The quick brown fox"

Quote the phrase to preserve it as one argument. Use -- before a phrase
that starts with a hyphen. All formats remove whitespace.
```

