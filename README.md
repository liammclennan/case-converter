# Case Converter

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

## Tests and specification verification

The tests cover all nine claims in the [Case Converter specification](https://specification-tool.com/api/projects/a38fc0b3-9c00-4461-b73d-94093659f779/nodes/2998ad40-c8ef-4c09-89ed-d88537b09624),
including its children. Each claim's four-character ID appears in the names of
its verifying tests. Tests execute the real CLI and check output and exit status.

```sh
npm run test:local  # Run tests and write test-results/results.json
npm test           # Run tests, then publish results to Specification Tool
```

For publishing, set `SYSTEM_SPECIFICATION_TOOL_API_KEY` in the environment or in
the git-ignored `.env` file (see `.env.example`). `npm test` uses the
`specification-tool` npm package, whose executable is named
`system-specification-tool`, to push the JSON report to the `Case Converter`
project. It publishes results even if tests fail and exits unsuccessfully if
either testing or publishing fails. Publishing requires network access.
