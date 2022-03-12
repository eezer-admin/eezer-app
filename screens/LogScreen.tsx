import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

import { TransportLogContext } from '../contexts/transportLogContext';
import TransportModel from '../models/TransportModel';
import { TransportLog } from '../types/Transports';

const LogRow = (item: object) => {
  const transport = item.item as TransportModel;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text>{transport.getReadableStartDate()}</Text>
      <Text>{transport.getReadableDuration()}</Text>
      <Text>{transport.isSynced() ? 'yes' : 'no'}</Text>
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
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <TouchableOpacity onPress={log.syncLocalTransports}>
        <Text>Sync</Text>
      </TouchableOpacity>

      <FlatList
        style={{ width: '100%' }}
        data={data as TransportLog}
        keyExtractor={(item, index) => `transport-${item.identifier}-${index}`}
        renderItem={(item) => <LogRow item={item.item} />}
      />

      <TouchableOpacity
        onPress={() => {
          log.clear();
        }}>
        <Text>Clear</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
