import globals from 'globals';

export default {
  ignorePatterns: ['dist'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react-refresh/recommended',
      ],
      env: {
        browser: true,
        es2020: true,
      },
      globals: globals.browser,
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
        ],
      },
    },
  ],
};