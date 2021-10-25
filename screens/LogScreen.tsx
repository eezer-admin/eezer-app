import * as React from 'react'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import i18n from '../assets/localization/Localization'
import { Text, View } from '../components/Themed'
import { TransportInterface } from '../interfaces'
import { getTransports } from '../models/Transports'

export default function LogScreen () {
  const [transports, setTransports] = useState([])
  const [transportsLoaded, setTransportsLoaded] = useState(false)
  const [viewTransport, setViewTransport] = useState<String>('')

  useEffect(() => {
    const fetchTransports = async () => {
      const result = await getTransports()
      setTransports(result)
      setTransportsLoaded(true)
    }
    fetchTransports()
  }, [])

  if (!transportsLoaded) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <FlatList
        ListHeaderComponent={() => (
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>{i18n.t('Date')}</Text>
          <Text style={{ textAlign: 'center' }}>{i18n.t('Time')}</Text>
          <Text>{i18n.t('Uploaded')}</Text>
        </View>
        )}
        data={transports}
        renderItem={({ item }: {item: TransportInterface}) => (
          <View>
            <TouchableOpacity onPress={() => setViewTransport(
              viewTransport === item.id ? '' : item.id
            )}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{item.getReadableDate()}</Text>
                <Text style={{ textAlign: 'center' }}>{item.secondsElapsed}</Text>
                <Text>{item.isUploaded ? 'Yes' : 'No'}</Text>
              </View>
            </TouchableOpacity>
            {viewTransport === item.id
              ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ textAlign: 'center' }}>{i18n.t('Driver')}</Text>
                  <Text style={{ textAlign: 'center' }}>{item.driver.name}</Text>
                </View>
                <View>
                  <Text style={{ textAlign: 'center' }}>{i18n.t('Distance')}</Text>
                  <Text style={{ textAlign: 'center' }}>{item.distanceKm}</Text>
                </View>
                <View>
                  <Text style={{ textAlign: 'center' }}>{i18n.t('Cause')}</Text>
                  <Text style={{ textAlign: 'center' }}>{item.cause}</Text>
                </View>
              </View>
                )
              : null}
          </View>
        )}
        keyExtractor={transport => transport.id} />
    </View>
  )
}
