import Logo from '@presentation/ui/Logo';
import GetBackgroundLocationPermissionUseCase from '@usecases/location/GetBackgroundLocationPermissionUseCase';
import RequestBackgroundLocationPermissionUseCase from '@usecases/location/RequestBackgroundLocationPermissionUseCase';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { __ } from '../../../localization/Localization';
import Styles from '../../../styles/Styles';

export default function RequestLocationPermissionModal() {
  const [modalVisible, setModalVisible] = useState(false);

  const grantAccess = async () => {
    await new RequestBackgroundLocationPermissionUseCase().execute();
    setModalVisible(false);
  };

  const denyAccess = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    (async () => {
      const { status } = await new GetBackgroundLocationPermissionUseCase().execute();

      if (status !== Location.PermissionStatus.GRANTED) {
        setModalVisible(true);
      }
    })();
  }, []);

  return (
    <Modal
      style={{
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 35 }}>
        <Logo />

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: Styles.margins.large * 2,
            marginBottom: Styles.margins.medium,
            textAlign: 'center',
          }}>
          {__('location.permission_heading')}
        </Text>
        <Text style={{ textAlign: 'center' }}>{__('location.permission_description')}</Text>

        <TouchableOpacity
          style={{
            ...Styles.button,
            ...Styles.button.green,
            marginTop: Styles.margins.large * 5,
            width: '100%',
          }}
          onPress={() => {
            grantAccess();
          }}>
          <Text style={{ ...Styles.text.default }}>{__('actions.agree')}</Text>
        </TouchableOpacity>

        <Pressable
          onPress={() => {
            denyAccess();
          }}
          style={{ marginTop: Styles.margins.large * 2 }}>
          <Text style={{ color: Styles.colors.red, fontWeight: 'bold' }}>{__('actions.no_thanks')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
