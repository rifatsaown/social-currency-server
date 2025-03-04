import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'error',
      'no-unused-expressions': 'error',
      'no-constant-condition': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-undef': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',

      'no-prototype-builtins': 'error',
      'no-async-promise-executor': 'error',
      'no-shadow': 'error',
      'no-use-before-define': 'error',
      'no-undef-init': 'error',
    },
  },
  {
    ignores: ['node_modules/', 'dist/'],
  },
];
