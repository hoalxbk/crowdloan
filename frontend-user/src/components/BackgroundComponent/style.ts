import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    backgroundComponent: {
      position: 'relative',
      width: '100%',

      '& .btn': {
        height: '42px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 27px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
  
        '&:hover': {
          cursor: 'pointer'
        }
      },
    },
    wrongNetwork: {
      position: 'absolute',
      width: '100%',
      height: '44px',
      background: 'rgba(208, 31, 54, 0.4)',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      '& .btn-close': {
        position: 'absolute',
        top: '10px',
        right: '20px',
        height: 'unset',
        padding: '0'
      },

      '& .btn-change-network': {
        background: 'none',
        border: '1px solid #FFFFFF',
        borderRadius: '30px',
        height: '28px',
        padding: '0 14px',
      },

      '& p, & p a': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#FFFFFF',
      },

      '& p a': {
        TextDecoration: 'underline'
      }
    },
    mainContent: {
      position: 'absolute',
      top: '0',
      left: '0',
      margin: '10% 80px',
      width: '575px',

      '& h1': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '66px',
        lineHeight: '66px',
        color: '#FFFFFF',
      },

      '& p': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#999999',
        marginTop: '22px'
      },
    },
    buttonArea: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '32px',

      '& .btn-view-pool': {
        backgroundColor: '#D01F36',
        borderRadius: '60px',
        marginRight: '12px'
      },

      '& .btn-subscriber': {
        backgroundColor: '#3232DC',
      }
    },
  };
});

export default useStyles;
