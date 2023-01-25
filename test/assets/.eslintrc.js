module.exports = {
  plugins: [
    'jest',
  ],
  extends: [
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  rules: {
    '@typescript-eslint/naming-convention': 'off',
    'array-bracket-spacing': 'off',
    'comma-dangle': 'off',
    'quotes': 'off',
    'quote-props': 'off',
    'max-len': 'off',
  },
};