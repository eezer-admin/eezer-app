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

Building and publishing the app can be done either via our preconfigured Github Actions or manually from your computer. Once the build is started, it can be tracked from the [Expo dashboard](https://expo.dev/accounts/eezer/projects/eezer).

#### Using Github Actions (recommended)

Go to the [Build & submit to app stores with EAS](https://github.com/eezer-admin/eezer-app/actions/workflows/eas-build.yml) action. Click Run Workflow and select the platform(s) you want to build and submit to. Make sure the `master` branch is used to avoid building unfinished feature branches.

#### Building and submitting locally

First, make sure you read the prerequisites and introduction to [Expo EAS](https://docs.expo.dev/build/setup/#prerequisites). For example, you must have EAS CLI installed on your computer.

```
eas login && eas build --platform android
```

The Android credentials are uploaded and configured in the [Expo dashboard](https://expo.dev/accounts/eezer/projects/eezer/credentials). These will automatically be used when running the command above. Note that for production builds that will be used to upload to the Play store, ` .aab` is recommended (the default format when running `eas build`).

## Testing the app

The test strategy of the app contains three steps:

1. Unit tests. These are run automatically on every open pull request. If a test fails the pull request should not be merged.
2. Developer testing. The developer should test new features on an emulator or physical device before merging the feature.
3. Acceptance testing. When the app is submitted to the app stores they will first be in an "internal track" (Play store) or "Testflight" (Apple app store). This means it can be installed and tested by Eezer internal testers as if it was a published version. If the tests go well, we can then publish the version for all users.

## Technical guidelines

The app is built using the Expo framework which wraps React Native. It helps us build a cross platform app using only one programming language (TypeScript).

The code is written using [Clean Architecture](https://betterprogramming.pub/the-ultimate-clean-architecture-template-for-typescript-projects-e53936269bb9). While this may seem a bit like overengineering the app, it has two main purposes:

1. Make the code testable.
2. Make it easy for new developers to understand the codebase.

All new code should be written using this pattern and should have test coverage.
