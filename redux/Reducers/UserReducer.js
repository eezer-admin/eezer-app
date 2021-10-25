import i18n from 'i18n-js'
import * as Localization from 'expo-localization'

const initialState = {
  locale: Localization.locale
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCALE': {
      i18n.locale = action.payload

      return { ...state, locale: action.payload }
    }
    default: return state
  }
}

export default userReducer
