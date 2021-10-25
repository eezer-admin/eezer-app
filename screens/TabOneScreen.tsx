import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import EditScreenInfo from '../components/EditScreenInfo'
import { Text, View } from '../components/Themed'
import i18n from '../assets/localization/Localization'
import { useDispatch, useSelector } from 'react-redux'
import { setLocale } from '../redux/Actions/UserActions'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function TabOneScreen () {
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()

  const getData = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('@transports')
      jsonValue = (jsonValue != null) ? JSON.parse(jsonValue) : null
      console.log(jsonValue)
    } catch (e) {
      // error reading value
    }
  }

  getData()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('Tab One')}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <TouchableOpacity onPress={() => dispatch(setLocale('en'))}>
        <Text>English</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => dispatch(setLocale('sv'))}>
        <Text>Svenska</Text>
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
