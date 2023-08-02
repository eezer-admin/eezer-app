import Bugsnag from '@bugsnag/expo';
import { DrawerNavigation } from '@presentation/ui/DrawerNavigation';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AppLoadingScreen from '@screens/app/AppLoadingScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import { container } from '@src/di/Container';
import * as Localization from 'expo-localization';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AuthContext, AuthProvider } from './contexts/authContext';
import { LanguageContext, LanguageProvider } from './contexts/languageContext';
import { TransportLogProvider } from './contexts/transportLogContext';
import i18n, { __, defaultLanguage, supportedLanguages } from './localization/Localization';
import CreateTransportationScreen from './screens/CreateTransportationScreen';
import LogScreen from './screens/LogScreen';
import ProfileScreen from './screens/ProfileScreen';
import Styles from './styles/Styles';

// require('dotenv').config()
Bugsnag.start();
SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();
i18n.locale = Localization.locale;

container.register();

const Router = () => {
  const auth = useContext(AuthContext);
  useContext(LanguageContext);

  if (!auth.authLoaded) {
    return <AppLoadingScreen />;
  }

  Location.requestForegroundPermissionsAsync();

  return (
    <TransportLogProvider style={{ flex: 1 }}>
      <NavigationContainer>
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
            <Drawer.Screen name="Login" component={LoginScreen} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </TransportLogProvider>
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
    <Text style={{ textAlign: 'center' }}>An unexpected error occurred. Please restart the app and try again.</Text>
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

  let initialLanguage = Localization.locale;
  if (supportedLanguages().indexOf(Localization.locale) < 0) {
    initialLanguage = defaultLanguage();
  }

  useEffect(() => {
    setAppIsReady(true);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
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
          </View>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
