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

process.exitCode = testStatus;
