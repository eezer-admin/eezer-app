import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';

import { TransportLogContext } from '../contexts/transportLogContext';
import { Transport, TransportLog } from '../types/Transports';

const LogRow = (item: object) => {
  const transport = item.item as Transport;

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text>{transport.started}</Text>
      <Text>{transport.reason}</Text>
      <Text>{transport.isSynced ? 'yes' : 'no'}</Text>
    </View>
  );
};

export default function LogScreen() {
  const [log] = useContext(TransportLogContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(log);
  }, [log]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList
        data={data as TransportLog}
        keyExtractor={(item, index) => `transport-${item.identifier}-${index}`}
        renderItem={(item) => <LogRow item={item.item} />}
      />
    </SafeAreaView>
  );
}
