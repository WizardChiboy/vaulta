// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = defineConfig([
  expoConfig,

  // Strict, type-aware rules for all TypeScript (uses tsconfig.json through the project service).
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Type-only imports must use `import type` (pairs with verbatimModuleSyntax).
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      // Allow numbers in template strings (`${count} left`); everything else must be a string.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Allow `onPress={() => router.push('/x')}`; other void-as-value uses are still errors.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      // React event props may receive async handlers; promises elsewhere must still be handled.
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  // Root config files run in Node (CommonJS).
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },

  eslintPluginPrettierRecommended,
  {
    rules: {
      // Keyboard handling lives in <Screen>. React Native's KeyboardAvoidingView does nothing
      // on Android edge-to-edge, so inputs end up hidden behind the keyboard.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['KeyboardAvoidingView'],
              message:
                'Use <Screen scroll> (react-native-keyboard-controller) so inputs stay above the keyboard.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/*', '.expo/*', 'android/*', 'ios/*', 'assets/vaulta-ui/*', 'expo-env.d.ts'],
  },
]);
