import { defineConfig, defineProject, mergeConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactPlugin from '@vitejs/plugin-react';

const baseConfig = defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: [
        [
          'json',
          {
            file: `../coverage.json`,
          },
        ],
      ],
      enabled: true,
    },
  },
  plugins: [tsconfigPaths()],
});

const uiConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: 'jsdom',
    },
  }),
);

export default mergeConfig(
  uiConfig,
  defineConfig({
    plugins: [reactPlugin()],
    test: {
      setupFiles: ['./vitest.setup.ts'],
    },
  }),
);
