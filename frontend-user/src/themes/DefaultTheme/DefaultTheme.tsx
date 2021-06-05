import { createMuiTheme } from '@material-ui/core/styles';
import { ZIndex } from '@material-ui/core/styles/zIndex';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

declare module '@material-ui/core/styles/zIndex' {
  interface ZIndex {
    negative: number;
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    zIndex: ZIndex;
  }

  interface ThemeOptions {
    custom?: any;
  }
}

export const createLemonadeTheme = (options: ThemeOptions = {}) => {
  return createMuiTheme(options);
};

const themeOptions = {
  colors: {
    white: '#FFFFFF',
    primary: '#FFCC00',
    secondary: '#3A39BB',
    primaryText: '#636363',
    secondaryText: '#363636',
    metamask: '#FF8F44',
    mainBackground: '#202020',
    cornflowerBlue: '#6195ED',
    malibu: '#6398FF',
    silverChalice: '#AEAEAE',
    tuna: '#303035',
    shark: '#191920',
    sharkLight: '#222228',
    abbey: '#44454B',
    cardinal: '#D01F36',
  },
};

const defaultTheme = createLemonadeTheme({
  custom: themeOptions,
});

export { themeOptions };
export default defaultTheme;