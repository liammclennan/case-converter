import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.mjs'],
    reporters: ['default', 'json'],
    outputFile: { json: 'test-results/results.json' },
  },
});
