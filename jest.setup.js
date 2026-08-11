jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('node-fetch');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.useFakeTimers();
