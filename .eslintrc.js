module.exports = {
  root: true,
  extends: 'airbnb',
  plugins: [
    'react',
    'react-hooks',
  ],
  parser: 'babel-eslint',
  env: {
    es6: true,
  },
  rules: {
    'jsx-quotes': ['warn', 'prefer-single'],
    'padded-blocks': 'off',
    'global-require': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/style-prop-object': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': ['error', { ignore: ['navigation'] }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
    'max-len': 'off',
    'func-names': 'off',
  },
  globals: {
    fetch: false,
    __DEV__: true,
  },
};