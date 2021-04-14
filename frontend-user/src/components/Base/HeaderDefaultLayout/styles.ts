import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    navBar: {
      gridArea: 'header',
      width: '100%',
      padding: '10px 80px',
      backgroundColor: '#020616',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      [theme.breakpoints.down('sm')]: {
        padding: '10px 40px',
      },
      [theme.breakpoints.only('xs')]: {
        padding: '10px 20px',
      }
    },
    navbarLink: {
      textAlign: 'center',
      display: 'inline-block'
    },
    navbarLogo: {

    },
    navbarBrand: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
      fontWeight: 300,
      marginTop: 5
    },
    navbarBrandBold: {
      color: '#D01F36'
    },
    rightBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    btn: {
      fontStyle: 'normal',
      fontWeight: 900,
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: '1px',
      color: '#FFFFFF',
      mixBlendMode: 'normal',
      backgroundColor: 'none',
      border: 'none',
      cursor: 'pointer',
    
      '&:focus': {
        outline: 'none'
      }
    },
    btnNetwork: {
      background: '#292C3F',
      padding: '8px 10px',
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      color: '#999999',
      marginLeft: 40,
      fontWeight: 600
    },
    btnConnect: {
      background: '#3232DC',
      height: 42,
      display: 'flex',
      alignItems: 'center',
      padding: '12px 14px',
      borderRadius: 20,
      marginLeft: 12,
      transition: '.2s all ease-out',

      '&:hover': {
        background: '#1515ae'
      }
    },
    btnConnectText: {
      marginLeft: 10 
    },
    btnLogout: {
      background: '#3232DC',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      outline: 'none',
      padding: '0 15px',
      height: 42,
    },
    btnAccount: {
      display: 'inline-block',
      backgroundColor: '#0C1018',
      padding: '8px 10px',
      borderRadius: 20,
      marginRight: '-12px',
    },
    btnChangeAppNetwork: {
      padding: '13px 11px',
      border: '2px solid #FFFFFF',
      boxSizing: 'border-box',
      borderRadius: 30,
      background: 'transparent',
      fontWeight: 600,
      color: 'white',
      cursor: 'pointer',
      transition: '.2s all ease-in',

      '&:focus': {
        outline: 'none'
      },

      '&:hover': {
        backgroundColor: 'white',
        color: '#D01F36',
      }
    },
    loginErrorBanner: {
      position: 'absolute',
      left: 0, 
      top: '100%',
      width: '100%',
      backgroundColor: '#d01f3666',
      fontSize: 15,
      color: 'white',
      padding: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 500,

      [theme.breakpoints.down('sm')]: {
        '& button': {
          minWidth: '200px',
        },
      }
    },
    loginErrorBannerText: {
      marginLeft: 10
    },
    loginErrorGuide: {
      color: 'white',
      textDecoration: 'underline',

      '&:hover': {
        color: 'white'
      }
    }
  };
});

export default useStyles;
