import Bugsnag from '@bugsnag/expo';
import LogScreen from '@presentation/screens/transport/LogScreen';
import { DrawerNavigation } from '@presentation/ui/DrawerNavigation';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AppLoadingScreen from '@screens/app/AppLoadingScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import ProfileScreen from '@screens/user/ProfileScreen';
import { container } from '@src/di/Container';
import * as Localization from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import i18n, { __, defaultLanguage, supportedLanguages } from './localization/Localization';

import { AuthContext, AuthProvider } from './contexts/authContext';
import { LanguageContext, LanguageProvider } from './contexts/languageContext';

import RequestLocationPermissionModal from '@presentation/location/RequestLocationPermissionModal';
import CreateTransportationScreen from '@presentation/screens/transport/CreateTransportationScreen';
import Styles from './styles/Styles';

// require('dotenv').config()
Bugsnag.start();
SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();
i18n.locale = Localization.getLocales()[0].languageCode;

container.register();

const Router = () => {
  const auth = useContext(AuthContext);
  useContext(LanguageContext);

  if (!auth.authLoaded) {
    return <AppLoadingScreen />;
  }

  return (
    <NavigationContainer style={{ flex: 1 }}>
      {auth.isLoggedIn() ? (
        <Drawer.Navigator
          drawerContent={(props: DrawerContentComponentProps) => <DrawerNavigation {...props} />}
          initialRouteName="CreateTransportation">
          <Drawer.Screen
            name={__('Select transportation')}
            navigationKey="CreateTransportation"
            component={CreateTransportationScreen}
          />
          <Drawer.Screen name={__('History')} navigationKey="History" component={LogScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
      ) : (
        <Drawer.Navigator
          drawerContent={(props: DrawerContentComponentProps) => <DrawerNavigation {...props} />}
          initialRouteName="Login">
          <Drawer.Screen name={__('Log in')} navigationKey="Login" component={LoginScreen} />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
};

const ErrorView = () => (
  <View
    style={{
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Styles.margins.large,
    }}>
    <Text style={{ textAlign: 'center' }}>
      An unexpected error occurred. Please restart the app and try again.
    </Text>
    <TouchableOpacity
      style={{ marginTop: Styles.margins.large, ...Styles.button, ...Styles.button.green }}
      onPress={() => {
        Updates.reloadAsync();
      }}>
      <Text style={Styles.button.text}>Restart</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const ErrorBoundary = Bugsnag.getPlugin('react');

  let initialLanguage = Localization.getLocales()[0].languageCode || defaultLanguage();
  if (supportedLanguages().indexOf(initialLanguage) < 0) {
    initialLanguage = defaultLanguage();
  }

  useEffect(() => {
    setTimeout(() => {
      setAppIsReady(true);
    }, 500);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <LanguageProvider language={initialLanguage}>
        <AuthProvider>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Router />
            <RequestLocationPermissionModal />
          </View>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
