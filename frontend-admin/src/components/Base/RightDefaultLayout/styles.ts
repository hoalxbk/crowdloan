import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    rightLayout: {
      width: '100%',
      padding: '30px 65px',
      minWidth: '1500px',
      backgroundColor: '#F9F9F9'
    },
    loginErrorBanner: {
      top: '100%',
      width: '100%',
      backgroundColor: '#5b0712fa',
      fontSize: 15,
      color: 'white',
      padding: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 500,
      zIndex: 99999,
      marginBottom: 25,

      [theme.breakpoints.down('sm')]: {
        '& button': {
          minWidth: '200px',
        },
      }
    },
    loginErrorBannerText: {
      font: 'normal normal 400 14px/24px Helvetica',
      marginLeft: 10,
      color: 'white',
      fontWeight: 500
    },
    loginErrorGuide: {
      color: 'white',
      textDecoration: 'underline',

      '&:hover': {
        color: 'white'
      }
    },
  };
});

export default useStyles;
