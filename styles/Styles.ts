const margins = {
  small: 5,
  medium: 10,
  large: 15,
};

const fontSizes = {
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

export default {
  margins,
  colors,
  fontSizes,

  container: {
    paddingHorizontal: margins.large,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    justifySelf: 'center',
    alignSelf: 'center',
  },

  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    width: '100%',
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
    text: {
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: colors.greenDark,
    },
    green: {
      backgroundColor: colors.greenLight,
    },
    red: {
      backgroundColor: colors.redLight,

      text: {
        color: colors.red,
      },
    },
  },

  text: {
    default: {
      fontSize: fontSizes.default,
    },
  },
};
