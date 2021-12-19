import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'

import Navigation from './navigation'
import store from './redux/store'
import { Provider } from 'react-redux'

import * as Localization from 'expo-localization'
import i18n from './assets/localization/Localization'
import { setTransports } from './models/Transports'

require('dotenv').config()
i18n.locale = Localization.locale

export default function App () {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  // setTransports([
  //   { date: '2021-01-01', distance: 5, time: 360, cause: 'Pregnancy', driverName: 'John Doe' },
  //   { date: '2021-05-05', distance: 15, time: 1058, cause: 'Injury', driverName: 'Jane Doe' },
  //   { date: '2021-01-07', distance: 12, time: 200, cause: 'Pregnancy', driverName: 'John Wick' }
  // ])

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </Provider>
      </SafeAreaProvider>
    )
  }
}
