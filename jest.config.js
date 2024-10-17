module.exports = {
  preset: 'jest-expo',
  collectCoverageFrom: [
    './**/*.(ts|tsx|js|mjs)',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
    '!./*.js',
    '!env.d.ts',
    '!dist/**',
    '!ios/**',
    '!android/**',
    '!__tests__/utils.ts',
    '!/interfaces/**',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.test.+(ts|tsx|js)'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '~src/(.*)$': '<rootDir>src/$1',
    '~tests/(.*)$': '<rootDir>__tests__/$1',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/', 'interfaces/', '.expo/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|i18n-js|@aws-sdk)',
  ],
  setupFiles: ['./jest.setup.js'],
};
