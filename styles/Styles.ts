import { StyleSheet, ViewStyle } from 'react-native';

const margins = {
  small: 5,
  medium: 10,
  large: 15,
};

export const fontSizes = {
  small: 12,
  medium: 14,
  default: 18,
};

const colors = {
  gray: '#DCDCDC',
  grayDark: '#D2D2D2',
  grayDarker: '#777777',
  greenLight: '#86efac',
  green: '#10b981',
  greenDark: '#059669',
  red: '#b91c1c',
  redLight: '#fca5a5',
  white: 'white',
};

// The boxed field shared by TextInputs and the read-only Views that display a value.
const field: ViewStyle = {
  backgroundColor: colors.white,
  borderRadius: 8,
  paddingVertical: 10,
  paddingHorizontal: 25,
  width: '100%',
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: margins.large,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  field,

  input: {
    ...field,
    textAlign: 'center',
  },

  inputWithError: {
    backgroundColor: colors.redLight,
    color: colors.red,
    fontWeight: 'bold',
  },

  button: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: colors.greenDark,
  },

  buttonGreen: {
    backgroundColor: colors.greenLight,
  },

  buttonRed: {
    backgroundColor: colors.redLight,
  },

  buttonRedText: {
    color: colors.red,
  },

  textDefault: {
    fontSize: fontSizes.default,
  },
});

export default {
  margins,
  colors,
  fontSizes,

  container: styles.container,
  field: styles.field,
  input: styles.input,
  inputWithError: styles.inputWithError,

  button: styles.button,
  buttonText: styles.buttonText,
  buttonGreen: styles.buttonGreen,
  buttonRed: styles.buttonRed,
  buttonRedText: styles.buttonRedText,

  text: { default: styles.textDefault },
};
