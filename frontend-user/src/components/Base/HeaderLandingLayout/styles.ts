import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    navBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 120px',
      background: '#000',
      width: '100%',
      color: '#FFFFFF',
      font: 'normal normal bold 16px/24px DM Sans',
      position: 'relative',
      top: 0,
      left: 0,
      zIndex: 1,

      '& > div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        '& a': {
          color: '#FFFFFF'
        },

        '&.connects i': {
          marginLeft: '20px',

          '&::before': {
            color: '#9F9F9F'
          },

          '&:hover::before': {
            color: '#D01F37'
          }
        }
      },
      [theme.breakpoints.down('sm')]: {
        position: 'static',
        padding: '10px 40px',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '10px 32px',
        flexDirection: 'row-reverse',
        position: 'relative',

        '& .logo img': {
          width: '30px',
        },

        '& .connects': {
          position: 'absolute',
          top: 'calc(100% + 31px)',
          right: '20px',
          flexDirection: 'column'
        }
      },
    },
    banner: {
      position: 'absolute',
      top: '80px',
      backgroundColor: 'rgba(50, 50, 200, 0.4)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center!important',
      padding: '10px 0',
      left: '0'
    },
    loginErrorBannerText: {
      font: 'normal normal 400 14px/24px Helvetica',
      display: 'flex',
      alignItems: 'center',
    },
    btnChangeAppNetwork: {
      padding: '0 15px',
      background: 'transparent',
      fontWeight: 600,
      color: 'white',
      cursor: 'pointer',
      transition: '.2s all ease-in',
      border: '1px solid #FFFFFF',
      boxSizing: 'border-box',
      borderRadius: '30px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',

      '&:focus': {
        outline: 'none'
      },

    }
  };
});

export default useStyles;
