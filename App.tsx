import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Localization from 'expo-localization';
import { useContext } from 'react';

import { DrawerNavigation } from './components/DrawerNavigation';
import { AuthContext, AuthProvider } from './contexts/authContext';
import { LanguageContext, LanguageProvider } from './contexts/languageContext';
import { TransportLogProvider } from './contexts/transportLogContext';
import i18n, { __, defaultLanguage, supportedLanguages } from './localization/Localization';
import CreateTransportationScreen from './screens/CreateTransportationScreen';
import LogScreen from './screens/LogScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

// require('dotenv').config()

const Drawer = createDrawerNavigator();
i18n.locale = Localization.locale;

const Router = () => {
  const auth = useContext(AuthContext);
  useContext(LanguageContext);

  return (
    <TransportLogProvider>
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

export default function App() {
  let initialLanguage = Localization.locale;
  if (supportedLanguages().indexOf(Localization.locale) < 0) {
    initialLanguage = defaultLanguage();
  }

  return (
    <LanguageProvider language={initialLanguage}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </LanguageProvider>
  );
}
