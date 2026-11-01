'use strict';

const { spawnSync } = require('node:child_process');
const { existsSync, mkdirSync, rmSync } = require('node:fs');
const { resolve } = require('node:path');

process.chdir(resolve(__dirname, '..'));
if (existsSync('.env')) process.loadEnvFile('.env');

const report = 'test-results/results.json';
mkdirSync('test-results', { recursive: true });
rmSync(report, { force: true });

function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}

const testStatus = run(resolve('node_modules/vitest/vitest.mjs'), ['run']);
let pushStatus = 0;
if (!existsSync(report)) {
  console.error('No test report was produced; results cannot be published.');
  pushStatus = 1;
} else if (!process.env.SYSTEM_SPECIFICATION_TOOL_API_KEY) {
  console.error('Set SYSTEM_SPECIFICATION_TOOL_API_KEY to publish results, or use npm run test:local.');
  pushStatus = 1;
} else {
  // The specification-tool package retains this executable name.
  pushStatus = run(resolve('node_modules/specification-tool/bin/system-specification-tool.mjs'), [
    'push', '--test-results', report, '--project', 'Case Converter',
  ]);
}

// Publish failing test runs too, without masking a test or publication failure.
process.exitCode = testStatus || pushStatus;
