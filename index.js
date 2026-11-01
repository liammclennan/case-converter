#!/usr/bin/env node
'use strict';

const { parseArgs } = require('node:util');

const formats = ['camel', 'pascal', 'snake'];
const help = `Usage: case-converter --to <camel|pascal|snake> "phrase"

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
`;

function convert(phrase, format) {
  if (!formats.includes(format)) {
    throw new Error(`Unsupported format "${format}". Choose camel, pascal, or snake.`);
  }
  const words = phrase.match(/\S+/gu) || [];
  const capitalize = (word) => word[0].toUpperCase() + word.slice(1);
  if (format === 'snake') return words.map((word) => word.toLowerCase()).join('_');
  return words.map((word, index) => (
    format === 'camel' && index === 0 ? word.toLowerCase() : capitalize(word)
  )).join('');
}

function main(args) {
  if (args.length === 0) {
    process.stdout.write(help);
    return;
  }
  try {
    const { values, positionals } = parseArgs({
      args,
      options: {
        to: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
      strict: true,
    });
    if (values.help) {
      process.stdout.write(help);
      return;
    }
    if (!values.to) throw new Error('Missing --to. Choose camel, pascal, or snake.');
    if (positionals.length !== 1) throw new Error('Provide exactly one quoted phrase.');
    process.stdout.write(`${convert(positionals[0], values.to)}\n`);
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\nRun with --help for usage.\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) main(process.argv.slice(2));

module.exports = { convert };
