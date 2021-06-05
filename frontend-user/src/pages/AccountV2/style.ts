import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    alertVerifyEmail: {
      position: 'relative',
      width: '100%',
      padding: '10px 0',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(50, 50, 200, 0.4)',

      '& .btn-close': {
        position: 'absolute',
        top: '50%',
        right: '15px',
        transform: 'translateY(-50%)'
      },

      '& span': {
        font: 'normal normal 400 14px/24px Helvetica',
        color: '#FFFFFF',
        paddingRight: '40px'
      }
    },

    sectionBot: {
      color: theme?.custom?.colors?.white,
      background: theme?.custom?.colors?.tuna,
      borderRadius: 12,
      padding: "36px 32px",
    },

    errorBanner: {
      color: 'white',
      backgroundColor: '#FF4C00',
      textAlign: 'center',
      padding: 12,
      marginBottom: 0,
      flex: 1,
    },
    title: {
      font: 'normal normal bold 28px/32px DM Sans',
      color: '#FFF',
      position: 'relative',

      '&:after': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        position: 'absolute',
        bottom: '-10px',
      }
    },

    mainContent: {
      display: 'flex',
      position: 'relative',
      marginTop: 10,
      flexDirection: 'column',
    },

    leftPanel: {
    },
    rightPanel: {
      maxWidth: '100%',
      width: '100%',
    },
    accountContainer: {
      padding: '50px 80px 80px 80px',
    },
    [theme.breakpoints.down('xs')]: {
      accountContainer: {
        padding: '24px',
      },
    }
  };
});

export default useStyles;
