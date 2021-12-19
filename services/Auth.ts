import axios from 'axios'
import { Config } from '../constants/Config'

export async function login (username: string, password: string): Promise<void> {
  const data = new URLSearchParams()
  data.append('username', username)
  data.append('password', password)

  return axios.post(`${Config.api.baseUrl}/login/access-token`, data, {
    headers: { Accept: 'application/x-www-form-urlencoded' }
  }).then(function (response) {
    console.log(response)
    // Store token in securestore.
    // Store user in redux.
  }).catch(function (error) {
    console.log(error)
    // Handle validation error.
    // Handle response error.
  })
}
