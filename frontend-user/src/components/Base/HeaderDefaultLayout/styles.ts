import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    navBar: {
      gridArea: 'header',
      width: '100%',
      padding: '10px 80px',
      backgroundColor: '#030925',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    rightBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    btnPool: {
      fontFamily: 'Telegraf',
      fontStyle: 'normal',
      fontWeight: 900,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '1px',
      color: '#FFFFFF',
      mixBlendMode: 'normal',
      backgroundColor: 'none',
      border: 'none',
    },
    btnConnect: {
      fontFamily: 'Telegraf',
      fontStyle: 'normal',
      fontWeight: 900,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '1px',
      color: '#FFFFFF',
      mixBlendMode: 'normal',
      background: '#3232DC',
      borderRadius: '8px',
      display: 'flex',
      height: 42,
    },
    btnLogout: {
      fontFamily: 'Telegraf',
      fontStyle: 'normal',
      fontWeight: 900,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '1px',
      color: '#FFFFFF',
      mixBlendMode: 'normal',
      background: '#3232DC',
      borderRadius: '8px',
      display: 'flex',
      height: 42,
    },
  };
});

export default useStyles;
