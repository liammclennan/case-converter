import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const executable = fileURLToPath(new URL('../index.js', import.meta.url));
const run = (...args) => spawnSync(process.execPath, [executable, ...args], { encoding: 'utf8' });
function expectConversion(format, phrase, expected) {
  const result = run('--to', format, phrase);
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(result.stdout).toBe(`${expected}\n`);
}

describe('Case Converter specification', () => {
  test.each([[], ['--help'], ['-h']])('[d435] help describes usage and all options: %j', (...args) => {
    const result = run(...args);
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    for (const text of ['Usage:', '--to', '--help', 'camel', 'pascal', 'snake', '"phrase"']) {
      expect(result.stdout).toContain(text);
    }
  });

  test.each([
    ['camel', 'theQuickBrownFox'],
    ['pascal', 'TheQuickBrownFox'],
    ['snake', 'the_quick_brown_fox'],
  ])('[7b03] --to selects %s', (format, expected) => {
    expectConversion(format, 'The quick brown fox', expected);
  });

  test.each([
    ['camel', 'theQuickBrownFoxJumpsOver'],
    ['pascal', 'TheQuickBrownFoxJumpsOver'],
    ['snake', 'the_quick_brown_fox_jumps_over'],
  ])('[72af] %s removes spaces, tabs, line breaks, and Unicode whitespace', (format, expected) => {
    expectConversion(format, ' \tThe\tquick\nbrown\r\nfox\u00a0jumps\u2003over\u2028\u2029\v\f ', expected);
  });

  test('[2b8a] camel lowercases the entire first word and capitalizes following initials', () => {
    expectConversion('camel', '  hELLO world tEsT  ', 'helloWorldTEsT');
    expectConversion('camel', 'HELLO', 'hello');
  });
  test('[d207] --to camel converts the specified example', () => {
    expectConversion('camel', 'The quick brown fox', 'theQuickBrownFox');
  });
  test('[ce0c] pascal capitalizes each word and removes whitespace', () => {
    expectConversion('pascal', '  hello world tEsT  ', 'HelloWorldTEsT');
    expectConversion('pascal', 'hello', 'Hello');
  });
  test('[7da6] --to pascal converts the specified example', () => {
    expectConversion('pascal', 'The quick brown fox', 'TheQuickBrownFox');
  });
  test('[fbbd] snake lowercases every word and inserts single underscores', () => {
    expectConversion('snake', '  hELLO   WORLD TeSt  ', 'hello_world_test');
    expectConversion('snake', 'HELLO', 'hello');
  });
  test('[f7aa] --to snake converts the specified example', () => {
    expectConversion('snake', 'The quick brown fox', 'the_quick_brown_fox');
  });

  test.each(['camel', 'pascal', 'snake'])('[72af] %s handles empty and whitespace-only phrases', (format) => {
    expectConversion(format, '', '');
    expectConversion(format, ' \t\n\u00a0 ', '');
  });
});

describe('CLI errors and argument handling', () => {
  test.each([
    [['hello'], 'Missing --to'],
    [['--to'], 'argument missing'],
    [['--to', 'kebab', 'hello'], 'Unsupported format'],
    [['--to', 'camel'], 'exactly one quoted phrase'],
    [['--to', 'camel', 'hello', 'world'], 'exactly one quoted phrase'],
    [['--unknown'], 'Unknown option'],
  ])('rejects invalid arguments %j', (args, message) => {
    const result = run(...args);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(message);
    expect(result.stderr).toContain('--help');
  });
  test('[7b03] accepts --to=camel', () => {
    const result = run('--to=camel', 'Hello world');
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('helloWorld\n');
  });
  test('accepts a hyphen-leading phrase after --', () => {
    const result = run('--to', 'snake', '--', '-Hello World');
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('-hello_world\n');
  });
});
