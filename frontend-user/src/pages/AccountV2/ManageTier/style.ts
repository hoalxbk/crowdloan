import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    content: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '8px', 
      padding: '25px 40px 15px 40px',
      marginTop: '60px',

      [theme.breakpoints.down('xs')]: {
        padding: '25px 20px 15px 20px',
        marginTop: '0',
      },

      '& .button-area': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
      },

      '& .button-area .btn': {
        height: '42px',
        borderRadius: '40px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '204px',

        '&:hover': {
          cursor: 'pointer'
        },

        '&.disabled': {
          backgroundColor: 'silver'
        }
      },

      '& .button-area .btn-lock': {
        background: '#3232DC',
        marginRight: '8px'
      },

      '& .button-area .btn-unlock': {
        background: '#D01F36',
      }
    },
    manageTier: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    walletBalance: {
      marginTop: '55px'
    },
    tableHead: {
      color: '#fff',
      font: 'normal normal bold 14px/18px DM Sans',
      marginBottom: '20px',

      '& .group': {
        display: 'flex',
        justifyContent: 'space-between'
      }
    },
    tableBody:  {
      color: '#fff',
      height: '260px',
      '& .group': {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: '48px',
        alignItems: 'center'
      },

      '& .group span': {
        width: '33%',

        '&:first-child': {
          font: 'normal normal bold 14px/18px DM Sans',
          color: '#fff'
        },
        '&:last-child': {
          textAlign: 'right',
          font: 'normal normal normal 14px/24px Helvetica',
          color: '#999999'
        },
        '&:nth-child(2)': {
          textAlign: 'center',
          font: 'normal normal normal 14px/24px Helvetica',
          color: '#999999'
        }
      }
    },
    textDefault: {
      fontFamily: 'Helvetica',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      color: '#999999',
    },
    balance: {
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '28px',
      lineHeight: '32px',
      color: '#FFFFFF',
      marginTop: '8px',
      marginBottom: '13px',
    },
    title: {
      color: '#FFF',
      font: 'normal normal bold 24px/32px DM Sans'
    }
  };
});

export default useStyles;
