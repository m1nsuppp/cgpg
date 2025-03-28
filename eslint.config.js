import love from 'eslint-config-love';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ...love,
    files: ['src/**/*.ts', 'src/**/*.tsx'],
  },
  {
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    files: ['**/*.ts', '**/*.tsx'],
  },
];
