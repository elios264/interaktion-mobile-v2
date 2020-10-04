module.exports = {
  root: true,
  extends: ['airbnb', 'airbnb/hooks'],
  plugins: [
    'react',
    'react-hooks',
    'import',
  ],
  settings: {
    'import/resolver': { 'babel-module': {} },
  },
  parser: 'babel-eslint',
  env: {
    es6: true,
  },
  rules: {
    'jsx-quotes': ['error', 'prefer-single'],
    'padded-blocks': 'off',
    'global-require': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/style-prop-object': 'off',
    'import/prefer-default-export': 'off',
    'react/prop-types': ['error', { ignore: ['navigation', 'route'] }],
    'max-len': 'off',
    'func-names': 'off',
    'no-param-reassign': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'no-use-before-define': ['error', { functions: true, classes: true, variables: false }],
    'newline-per-chained-call': 'off',
    'no-underscore-dangle': ['error', {
      allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
      allowAfterThis: true,
      allowAfterSuper: false,
      enforceInMethodNames: true,
    }],
    'react/forbid-prop-types': ['error', {
      forbid: ['any', 'array'],
      checkContextTypes: true,
      checkChildContextTypes: true,
    }],
  },
  globals: {
    fetch: false,
    __DEV__: true,
  },
};
