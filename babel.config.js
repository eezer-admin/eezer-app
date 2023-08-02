module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@usecases': './src/domain/usecases',
            '@entities': './src/domain/entities',
            '@repositories': './src/data/repositories',
            '@presentation': './src/presentation',
            '@screens': './src/presentation/screens',
            '@src': './src',
            '@tests': './__tests__',
            '@interfaces': './interfaces',
          },
        },
      ],
    ],
  };
};
