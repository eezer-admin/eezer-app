import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

import Logo from '../components/Logo';
import { AuthContext } from '../contexts/authContext';
import { LanguageContext } from '../contexts/languageContext';
import { TransportContext, TransportProvider } from '../contexts/transportContext';
import { __ } from '../localization/Localization';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';
import CompleteTransportationScreen from './CompleteTransportationScreen';
import StartTransportationScreen from './StartTransportationScreen';
import StopTransportationScreen from './StopTransportationScreen';

const Stack = createNativeStackNavigator();

function CreateTransportation({ navigation }) {
  const auth = useContext(AuthContext);
  const [language, setLanguage] = useContext(LanguageContext);

  return (
    <View style={Styles.container}>
      <Logo />

      <Text>{__('Select your transportation')}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            navigation.navigate('CreatePregnancyTransportation');
          }}>
          <Image
            source={require('../assets/pin-transport-pregnancy-large.png')}
            style={{
              width: 130,
              height: 208.21,
            }}
          />
          <Text>{__('Pregnancy')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            navigation.navigate('CreateOtherTransportation');
          }}>
          <Image
            source={require('../assets/pin-transport-other-large.png')}
            style={{
              width: 130,
              height: 208.21,
            }}
          />
          <Text>{__('Other')}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          auth.logout();
        }}>
        <Text>{__('Logout')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setLanguage('en');
        }}>
        <Text>{__('English')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setLanguage('sv');
        }}>
        <Text>{__('Swedish')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function CreatePregnancyTransportationScreen({ navigation }) {
  return (
    <View style={Styles.container}>
      <Logo />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={{ ...Styles.button }}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Delivery' });
          }}>
          <Image
            source={require('../assets/pin-transport-delivery-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text>{__('Delivery')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...Styles.button }}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Checkup' });
          }}>
          <Image
            source={require('../assets/pin-transport-checkup-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text>Check up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...Styles.button }}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Other' });
          }}>
          <Image
            source={require('../assets/pin-transport-other-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text>{__('Other')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CreateOtherTransportationScreen({ navigation }) {
  return (
    <View style={Styles.container}>
      <Logo />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Accident' });
          }}>
          <Image
            source={require('../assets/pin-transport-accident-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text>{__('Accident')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Sickness' });
          }}>
          <Image
            source={require('../assets/pin-transport-sickness-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text>{__('Sickness')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Misc' });
          }}>
          <Image
            source={require('../assets/pin-transport-misc-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text>{__('Misc.')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Router = () => {
  const context = useContext(TransportContext);
  const [loaded, setLoaded] = useState(false);
  const [transport, setTransport] = useState(null);
  const [initialRouteName, setInitialRouteName] = useState('CreateTransportation');

  useEffect(() => {
    context.get().then((transport: TransportModel | null) => {
      if (!transport || (!transport.isStarted() && !transport.isEnded())) {
        setInitialRouteName('CreateTransportation');
      } else if (transport.isOngoing()) {
        setInitialRouteName('StopTransportation');
      } else {
        setInitialRouteName('CompleteTransportation');
      }

      setLoaded(true);

      if (transport) {
        setTransport(transport);
      }
    });
  }, []);

  return loaded ? (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="CreateTransportation" component={CreateTransportation} options={{ headerLeft: null }} />
      <Stack.Screen name="CreatePregnancyTransportation" component={CreatePregnancyTransportationScreen} />
      <Stack.Screen name="CreateOtherTransportation" component={CreateOtherTransportationScreen} />
      <Stack.Screen
        name="StartTransportation"
        component={StartTransportationScreen}
        options={({ route }) => ({ title: __(route.params.reason) })}
      />
      <Stack.Screen
        name="StopTransportation"
        component={StopTransportationScreen}
        options={({ route }) => ({
          title: transport ? __(transport.data.reason) : __('Stop transport'),
          headerLeft: (props) => null,
        })}
      />
      <Stack.Screen
        name="CompleteTransportation"
        component={CompleteTransportationScreen}
        options={({ route }) => ({
          title: transport ? __(transport.data.reason) : __('Complete transport'),
          headerLeft: null,
        })}
      />
    </Stack.Navigator>
  ) : (
    <ActivityIndicator />
  );
};

export default function CreateTransportationScreen() {
  return (
    <TransportProvider>
      <Router />
    </TransportProvider>
  );
}
