// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Test tooling runs in Node with the jest globals, neither of which the
    // Expo (react-native) config declares.
    files: ["__tests__/**", "jest.setup.js"],
    languageOptions: {
      globals: {
        ...require("globals").node,
        ...require("globals").jest,
      },
    },
  }
]);
