import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Logo from '@src/presentation/ui/Logo';
import { ClearTransportUseCase } from '@usecases/transport/ClearTransportUseCase';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

import { LanguageContext } from '../../../../contexts/languageContext';
import { TransportContext, TransportProvider } from '../../../../contexts/transportContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';
import StartTransportationScreen from './StartTransportationScreen';
import StopTransportationScreen from './StopTransportationScreen';
import TransportationSummaryScreen from './TransportationSummaryScreen';

const Stack = createNativeStackNavigator();

function CreateTransportation({ navigation }) {
  useContext(LanguageContext);

  return (
    <View style={Styles.container}>
      <Logo />

      <Text style={{ ...Styles.text.default }}>{__('Select your transportation')}</Text>

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
            source={require('../../../../assets/pin-transport-pregnancy-large.png')}
            style={{
              width: 130,
              height: 208.21,
            }}
          />
          <Text style={{ ...Styles.text.default }}>{__('Pregnancy')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.button}
          onPress={() => {
            navigation.navigate('CreateOtherTransportation');
          }}>
          <Image
            source={require('../../../../assets/pin-transport-other-large.png')}
            style={{
              width: 130,
              height: 208.21,
            }}
          />
          <Text style={{ ...Styles.text.default }}>{__('Other')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CreatePregnancyTransportationScreen({ navigation }) {
  useContext(LanguageContext);

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
            source={require('../../../../assets/pin-transport-delivery-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text style={{ ...Styles.text.default }}>{__('Delivery')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...Styles.button }}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Checkup' });
          }}>
          <Image
            source={require('../../../../assets/pin-transport-checkup-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text style={{ ...Styles.text.default }}>{__('Check up')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...Styles.button }}
          onPress={() => {
            navigation.navigate('StartTransportation', { reason: 'Other' });
          }}>
          <Image
            source={require('../../../../assets/pin-transport-other-small.png')}
            style={{
              width: 65,
              height: 65,
            }}
          />
          <Text style={{ ...Styles.text.default }}>{__('Other')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CreateOtherTransportationScreen({ navigation }) {
  useContext(LanguageContext);

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
            source={require('../../../../assets/pin-transport-accident-small.png')}
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
            source={require('../../../../assets/pin-transport-sickness-small.png')}
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
            source={require('../../../../assets/pin-transport-misc-small.png')}
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
  useContext(LanguageContext);
  const context = useContext(TransportContext);
  const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

  const determineInitialRoute = async () => {
    if (context.transport.isOngoing()) {
      setInitialRouteName('StopTransportation');
    } else {
      await new ClearTransportUseCase().execute();
      setInitialRouteName('CreateTransportation');
    }
  };

  useEffect(() => {
    determineInitialRoute();
  }, [context.transport]);

  return initialRouteName ? (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
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
          title: context.transport ? __(context.transport.reason) : __('Stop transport'),
          headerLeft: (props) => null,
        })}
      />
      <Stack.Screen
        name="TransportationSummary"
        component={TransportationSummaryScreen}
        options={({ route }) => ({
          title: context.transport ? __(context.transport.reason) : __('Summary'),
          headerLeft: (props) => null,
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
