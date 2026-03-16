import eslint from '@eslint/js'
import typescriptEslint from 'typescript-eslint'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'

export default typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  preferArrowFunctions.configs.all,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'preserve-caught-error': 'off',
    },
  },
)
