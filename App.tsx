import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as Localization from 'expo-localization';
import * as TaskManager from 'expo-task-manager';
import { useContext } from 'react';
import { View } from 'react-native';

import { AuthContext, AuthProvider } from './contexts/authContext';
import { LanguageProvider } from './contexts/languageContext';
import { TransportLogProvider } from './contexts/transportLogContext';
import i18n, { __ } from './localization/Localization';
import CreateTransportationScreen from './screens/CreateTransportationScreen';
import LogScreen from './screens/LogScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import Styles from './styles/Styles';

// require('dotenv').config()

const Drawer = createDrawerNavigator();
i18n.locale = Localization.locale;

const Router = () => {
  const auth = useContext(AuthContext);

  return (
    <LanguageProvider language={Localization.locale}>
      <TransportLogProvider>
        <NavigationContainer>
          {auth.isLoggedIn() ? (
            <Drawer.Navigator initialRouteName="CreateTransportation">
              <Drawer.Screen
                name={__('Select transportation')}
                navigationKey="CreateTransportation"
                component={CreateTransportationScreen}
              />
              <Drawer.Screen name={__('History')} navigationKey="History" component={LogScreen} />
              <Drawer.Screen name="Profile" component={ProfileScreen} />
            </Drawer.Navigator>
          ) : (
            <Drawer.Navigator initialRouteName="Login">
              <Drawer.Screen name="Login" component={LoginScreen} />
            </Drawer.Navigator>
          )}
        </NavigationContainer>
      </TransportLogProvider>
    </LanguageProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
