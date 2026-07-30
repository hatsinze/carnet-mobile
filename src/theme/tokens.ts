export const colors = {
  encre: '#14424D',
  encreDark: '#0D3338',
  encreMuted: '#7A9EA6',
  encreLight: '#E8F4F6',
  ardoise: '#20242B',
  brume: '#F7F8FA',
  blanc: '#FFFFFF',
  sauge: '#4C7A66',
  saugeLight: '#EAF3EE',
  brique: '#B85C3E',
  briqueLight: '#FBEEE9',
  soleil: '#C99A3E',
  soleilLight: '#FBF3E1',
  or: '#D4A539',
  orLight: '#F5D76E',
  ligne: '#E4E2DC',
  ardoiseMuted: 'rgba(32, 36, 43, 0.55)',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
};

export const radius = {
  sm: 8, md: 14, lg: 20, xl: 28,
};

export const fonts = {
  displayLight: 'Fraunces_300Light',
  displayRegular: 'Fraunces_400Regular',
  displaySemiBold: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  displayBlack: 'Fraunces_900Black',
  body: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  bodySemiBold: 'IBMPlexSans_600SemiBold',
  bodyBold: 'IBMPlexSans_700Bold',
  mono: 'IBMPlexMono_500Medium',
  monoSemiBold: 'IBMPlexMono_600SemiBold',
  monoBold: 'IBMPlexMono_700Bold',
};

export const typography = {
  h1: { fontFamily: fonts.displayBold, fontSize: 30, lineHeight: 36 },
  h2: { fontFamily: fonts.bodySemiBold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
};