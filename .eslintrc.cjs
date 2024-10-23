module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'plugin:jest/recommended'],
  extends: ['xo', 'xo-typescript', 'prettier'],
  rules: {
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/prefer-literal-enum-member': 0,
    '@typescript-eslint/consistent-type-definitions': 0,
    '@typescript-eslint/naming-convention': 0,
    'no-eq-null': 0,
    'no-await-in-loop': 0,
    eqeqeq: ['error', 'smart'],
    'capitalized-comments': 0,
  },
};
