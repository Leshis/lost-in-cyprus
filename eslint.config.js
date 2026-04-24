import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx,ts}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // 1. Config for standard .ts files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
  },

  // 2. Config for .vue files (keep this as you had it)
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: pluginVue.parser, // Use Vue parser as the primary
      parserOptions: {
        parser: typescriptParser, // Tell it to use TS for the <script> block
      },
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
])