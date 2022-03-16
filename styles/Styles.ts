const margins = {
  small: 5,
  medium: 10,
  large: 15,
};

const fontSizes = {
  small: 12,
  medium: 14,
};

const colors = {
  gray: '#DCDCDC',
  grayDark: '#D2D2D2',
  green: '#6FD25F',
  red: '',
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

  button: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    text: {
      textTransform: 'uppercase',
    },
    green: {
      backgroundColor: colors.green,
    },
    red: {
      backgroundColor: '#AD2A43',
    },
  },
};
