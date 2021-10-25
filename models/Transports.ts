import AsyncStorage from '@react-native-async-storage/async-storage'
import { TransportInterface, UnmappedTransportInterface } from '../interfaces'
import { Transport } from './Transport'

export async function getTransports (): Promise<TransportInterface> {
  let transports

  try {
    transports = await AsyncStorage.getItem('@transports')
    transports = (transports != null) ? JSON.parse(transports) : []
  } catch (e) {
    console.warn('Unable to get transports', e)
    transports = []
  }

  return transports.map((transport: Transport) => {
    return new Transport(transport)
  })
}

export async function setTransports (transports: Array<UnmappedTransportInterface>): Promise<TransportInterface> {
  console.log(transports)
  try {
    await AsyncStorage.setItem('@transports', JSON.stringify(transports))
  } catch (e) {
    console.warn('Unable to set transports', e)
  }

  return transports.map((transport: UnmappedTransportInterface) => {
    return new Transport(transport)
  })
}
