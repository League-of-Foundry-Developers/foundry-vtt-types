module.exports = {
  '*.(d.ts|test-d.ts)': ['eslint --fix', () => 'tsd'],
  '*.(js|json)': 'prettier --write'
};
