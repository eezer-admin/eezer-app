import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';

import { AuthContext } from '../contexts/authContext';
import { TransportLogContext } from '../contexts/transportLogContext';
import { __ } from '../localization/Localization';
import TransportModel from '../models/TransportModel';
import Styles from '../styles/Styles';
import { TransportLog } from '../types/Transports';

const LogRow = (item: object) => {
  const auth = useContext(AuthContext);
  const transport = item.item as TransportModel;

  const [showDetails, setShowDetails] = useState(false);
  // const syncedIcon = transport.isSynced()
  //   ? require('../assets/icon-synced-true.png')
  //  : require('../assets/icon-synced-false.png');

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setShowDetails(!showDetails);
        }}
        style={{
          backgroundColor: showDetails ? Styles.colors.grayDark : null,
          paddingVertical: Styles.margins.large,
          paddingHorizontal: Styles.container.paddingHorizontal,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ width: '33%' }}>{transport.getReadableStartDate()}</Text>
        <Text style={{ width: '33%', textAlign: 'center' }}>{transport.getReadableDuration()}</Text>
        <Text style={{ width: '33%', textAlign: 'right' }}>{transport.isSynced() ? __('Yes') : __('No')}</Text>
      </TouchableOpacity>

      {showDetails ? (
        <View
          style={{
            paddingVertical: Styles.margins.large,
            paddingHorizontal: Styles.container.paddingHorizontal,
            backgroundColor: Styles.colors.gray,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ width: '33%' }}>
            <Text style={{ fontSize: Styles.fontSizes.small }}>{__('Driver')}</Text>
            <Text style={{ fontSize: Styles.fontSizes.small }}>
              {auth.user.first_name} {auth.user.last_name}
            </Text>
          </View>
          <View style={{ width: '33%' }}>
            <Text style={{ textAlign: 'center', fontSize: Styles.fontSizes.small }}>{__('Distance')}</Text>
            <Text style={{ textAlign: 'center', fontSize: Styles.fontSizes.small }}>
              {transport.getReadableDistance()}
            </Text>
          </View>
          <View style={{ width: '33%' }}>
            <Text style={{ textAlign: 'right', fontSize: Styles.fontSizes.small }}>{__('Cause')}</Text>
            <Text style={{ textAlign: 'right', fontSize: Styles.fontSizes.small }}>{transport.data.reason}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default function LogScreen() {
  const log = useContext(TransportLogContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(log.data);
  }, [log.data]);

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
          onPress={log.syncLocalTransports}>
          <Image
            source={require('../assets/icon-upload.png')}
            style={{
              width: 32,
              height: 32,
            }}
          />
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
        <Text style={{ width: '33%' }}>{__('Date')}</Text>
        <Text style={{ width: '33%', textAlign: 'center' }}>{__('Time')}</Text>
        <Text style={{ width: '33%', textAlign: 'right' }}>{__('Uploaded')}</Text>
      </View>
      <FlatList
        style={{ width: '100%' }}
        data={data as TransportLog}
        keyExtractor={(item, index) => `transport-${item.identifier}-${index}`}
        renderItem={(item) => <LogRow item={item.item} />}
      />
    </SafeAreaView>
  );
}
