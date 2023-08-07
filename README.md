# Eezer App

This app is used by the drivers to log the transports.

## Getting started

To get started, clone the repository. Then follow these commands:

```
// 1. Install dependencies:
yarn

// 2. Run the tests:
yarn test

// 3. Run the app:
npx expo start
```

## Building and publishing the app

First, make sure you read the prerequisites and introduction to [Expo EAS](https://docs.expo.dev/build/setup/#prerequisites). For example, you must have EAS CLI installed on your computer.

### Creating an installable APK

This is useful for generating a file that can be installed on local devices and emulators to test with.

```
eas login && eas build -p android --profile preview
```

### Creating a production build for the Play store

```
eas login && eas build --platform android
```

The Android credentials are uploaded and configured in the [Expo dashboard](https://expo.dev/accounts/eezer/projects/eezer/credentials). These will automatically be used when running the command above. Note that for production builds that will be used to upload to the Play store, ` .aab` is recommended (the default format when running `eas build`).

## Technical guidelines

The app is built using the Expo framework which wraps React Native. It helps us build a cross platform app using only one programming language (TypeScript).

The code is written using [Clean Architecture](https://betterprogramming.pub/the-ultimate-clean-architecture-template-for-typescript-projects-e53936269bb9). While this may seem a bit like overengineering the app, it has two main purposes:

1. Make the code testable.
2. Make it easy for new developers to understand the codebase.

All new code should be written using this pattern and should have test coverage.
