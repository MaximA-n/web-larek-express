const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'coverage/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',

      'no-underscore-dangle': [
        'error',
        { allow: ['_id'] }
      ],

      // Финальная удобная настройка для Express/TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_|^req$|^res$|^next$|^file$',
          varsIgnorePattern: '^_|^CallbackError$',
          caughtErrorsIgnorePattern: '^_|err|error',
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
          // Позволяет игнорировать неиспользуемые переменные при деструктуризации
          vars: 'all',
        },
      ],
    },
  }
);