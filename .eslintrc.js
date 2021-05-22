module.exports = {
  env: {
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './test-d/tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  rules: {
    'eslint/lines-between-class-members': 'off',
    'tsdoc/syntax': 'warn',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/lines-between-class-members': ['error'],
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: {
          memberTypes: [
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'static-field',

            // static accessors go here

            'public-static-method',
            'protected-static-method',
            'private-static-method',
            'static-method',

            'public-constructor',
            'protected-constructor',
            'private-constructor',
            'constructor',

            'signature',

            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'instance-field',

            // instance accessors go here

            'public-abstract-field',
            'protected-abstract-field',
            'private-abstract-field',
            'abstract-field',

            'public-instance-method',
            'protected-instance-method',
            'private-instance-method',
            'instance-method',

            'public-abstract-method',
            'protected-abstract-method',
            'private-abstract-method',
            'abstract-method',

            'public-field',
            'protected-field',
            'private-field',
            'field',

            'public-method',
            'protected-method',
            'private-method',
            'method'
          ],
          order: 'alphabetically'
        }
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
