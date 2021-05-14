module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    'src',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testURL: 'http://localhost/',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
  ],
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],
  globals: {
    'ts-jest': {
      diagnostics: true,
    },
  },
};
