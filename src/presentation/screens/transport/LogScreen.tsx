import TransportLogRow from '@presentation/ui/TransportLogRow';
import { Transport } from '@src/domain/entities/Transport';
import { GetFullTransportLogUseCase } from '@usecases/transport/GetFullTransportLogUseCase';
import { SyncLocalTransportsToBackendUseCase } from '@usecases/transport/SyncLocalTransportsToBackendUseCase';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { LanguageContext } from '../../../../contexts/languageContext';
import { __ } from '../../../../localization/Localization';
import Styles from '../../../../styles/Styles';

export default function LogScreen() {
  useContext(LanguageContext);
  const [log, setLog] = useState<Transport[]>([]);

  const syncTransports = async () => {
    const response = await new SyncLocalTransportsToBackendUseCase().execute();

    if (response) {
      setLog(response);
    }
  };

  const refresh = async () => {
    const data = await new GetFullTransportLogUseCase().execute();

    setLog(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          ...Styles.container,
          paddingVertical: Styles.margins.medium,
          flex: 0,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            ...Styles.button,
            ...Styles.button.green,
            flex: 1,
          }}
          onPress={() => {
            syncTransports();
          }}>
          <Image
            source={require('../../../../assets/icon-upload.png')}
            style={{
              width: 32,
              height: 32,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...Styles.button,
            flex: 1,
          }}
          onPress={() => {
            refresh();
          }}>
          <Text style={{ ...Styles.text.default }}>{__('Refresh')}</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: Styles.colors.gray,
          paddingVertical: Styles.margins.medium,
          paddingHorizontal: Styles.container.paddingHorizontal,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ width: '33%', ...Styles.text.default }}>{__('Date')}</Text>
        <Text style={{ width: '33%', textAlign: 'center', ...Styles.text.default }}>{__('Time')}</Text>
        <Text style={{ width: '33%', textAlign: 'right', ...Styles.text.default }}>{__('Uploaded')}</Text>
      </View>
      <FlatList
        style={{ width: '100%' }}
        data={log}
        keyExtractor={(item, index) => `transport-${item?.identifier || item?.id}-${index}`}
        renderItem={(item) => <TransportLogRow transport={item.item} />}
      />
    </SafeAreaView>
  );
}
