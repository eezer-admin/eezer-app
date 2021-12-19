import * as React from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import { Text, View } from '../components/Themed'
import i18n from '../assets/localization/Localization'
import { useDispatch, useSelector } from 'react-redux'
import { setLocale } from '../redux/Actions/UserActions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Elements } from '../styles'
import { login } from '../services/Auth'
import { Spacer } from '../components/Spacer'

export default function LoginScreen () {
  const [username, onChangeText] = React.useState('')
  const [password, onChangePassword] = React.useState('')

  return (
    <View style={Elements.Layout.default}>
      <View lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TextInput
        style={Elements.Inputs.Textfield}
        placeholder={i18n.t('Username')}
        onChangeText={text => onChangeText(text)}
        value={username}
      />
      <Spacer />
      <TextInput
        style={Elements.Inputs.Textfield}
        placeholder={i18n.t('Password')}
        onChangeText={text => onChangePassword(text)}
        secureTextEntry
        value={password}
      />
      <Spacer />
      <TouchableOpacity style={Elements.Buttons.Green} onPress={() => { login(username, password) }}>
        <Text>{i18n.t('Log in')}</Text>
      </TouchableOpacity>
    </View>
  )
}
