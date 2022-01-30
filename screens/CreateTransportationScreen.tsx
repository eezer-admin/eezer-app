import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { AuthContext } from '../contexts/authContext';
import { LanguageContext } from '../contexts/languageContext';
import { __ } from '../localization/Localization';
import CompleteTransportationScreen from './CompleteTransportationScreen';
import StartTransportationScreen from './StartTransportationScreen';
import StopTransportationScreen from './StopTransportationScreen';

const Stack = createNativeStackNavigator();

function CreateTransportation({ navigation }) {
  const auth = useContext(AuthContext);
  const [language, setLanguage] = useContext(LanguageContext);
  return (
    <View>
      <Text>{__('Select your transportation')}</Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreatePregnancyTransportation');
        }}>
        <Text>{__('Pregnancy')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateOtherTransportation');
        }}>
        <Text>Other</Text>
      </TouchableOpacity>

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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StartTransportation', { type: 'pregnancy.delivery' });
        }}>
        <Text>Delivery</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StartTransportation', { type: 'pregnancy.checkup' });
        }}>
        <Text>Check up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StartTransportation', { type: 'pregnancy.other' });
        }}>
        <Text>Other</Text>
      </TouchableOpacity>
    </View>
  );
}

function CreateOtherTransportationScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StartTransportation', { type: 'other.accident' });
        }}>
        <Text>Accident</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StartTransportation', { type: 'other.sickness' });
        }}>
        <Text>Sickness</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('StartTransportation', { type: 'other.misc' });
        }}>
        <Text>Misc.</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CreateTransportationScreen() {
  return (
    <Stack.Navigator initialRouteName="CreateTransportation">
      <Stack.Screen name="CreateTransportation" component={CreateTransportation} />
      <Stack.Screen name="CreatePregnancyTransportation" component={CreatePregnancyTransportationScreen} />
      <Stack.Screen name="CreateOtherTransportation" component={CreateOtherTransportationScreen} />
      <Stack.Screen name="StartTransportation" component={StartTransportationScreen} />
      <Stack.Screen name="StopTransportation" component={StopTransportationScreen} />
      <Stack.Screen name="CompleteTransportation" component={CompleteTransportationScreen} />
    </Stack.Navigator>
  );
}
