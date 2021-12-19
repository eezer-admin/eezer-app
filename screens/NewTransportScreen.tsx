import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import i18n from '../assets/localization/Localization'

import { Text, View } from '../components/Themed'
import { Elements } from '../styles'

export default function NewTransportScreen () {
  const [transportType, onChangeTransportType] = React.useState('')

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('Select your transportation')}</Text>

      <TouchableOpacity style={Elements.Buttons.Green} onPress={() => { onChangeTransportType('pregnancy') }}>
        <Text>{i18n.t('Pregnancy')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Elements.Buttons.Green} onPress={() => { onChangeTransportType('other') }}>
        <Text>{i18n.t('Other')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
})
