import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    content: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '8px', 
      padding: '25px 40px 15px 40px',

      [theme.breakpoints.down('xs')]: {
        padding: '25px 20px 15px 20px',
      },

      '& .button-area': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
      },

      '& .button-area .btn': {
        height: '28px',
        borderRadius: '40px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        textAlign: 'right',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

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

    },
    tableHead: {
      color: '#fff',

      '& .group': {
        display: 'flex',
        justifyContent: 'space-between'
      }
    },
    tableBody:  {
      color: '#fff',
      '& .group': {
        display: 'flex',
        justifyContent: 'space-between',
      },

      '& .group span': {
        width: '33%',

        '&:last-child': {
          textAlign: 'right'
        },
        '&:nth-child(2)': {
          textAlign: 'center'
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
  };
});

export default useStyles;
