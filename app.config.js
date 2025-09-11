import 'dotenv/config';

export default {
  expo: {
    name: 'FairFriends',
    slug: 'FairFriends',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    sdkVersion: '54.0.0',
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    updates: {
      url: 'https://u.expo.dev/b2f48f01-eee6-48f6-b861-102b897a600b',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'b2f48f01-eee6-48f6-b861-102b897a600b',
      },
      EXPO_PUBLIC_API: process.env.EXPO_PUBLIC_API,
    },
  },
};