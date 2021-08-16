module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {},
}
