import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    btnGroup: {
      marginTop: 40,

      '& button:first-child': {
        marginRight: 10
      }
    },
    buyTokenForm: {
      marginTop: 30,
      marginRight: 120,
      width: '50%',

      [theme.breakpoints.down('xs')]: {
        width: '100%'
      },
    },
    buyTokenFormTitle: {
      fontSize: 15,
      fontWeight: 700,
      marginBottom: 20,
      lineHeight: '24px'
    },
    buyTokenInputForm: {
      background: '#11152A',
      maxWidth: 380,
      padding: '10px 12px',
      borderRadius: 4
    },
    buyTokenInputWrapper: {
      marginTop: 15,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      '& span': {
        fontWeight: 'bold'
      }
    },
    buyTokenInput: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontWeight: 700,

      '&:focus': {
        outline: 'none'
      }
    },
    buyTokenInputLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#999999',
      fontSize: 14,
      fontWeight: 400
    },
    buyTokenFee: {
      color: '#999999',
      marginTop: 10
    },
    buyTokenEstimate: {
      marginTop: 32
    },
    buyTokenEstimateLabel: {
      fontWeight: 700,
      fontSize: 15
    },
    buyTokenEstimateAmount: {
      color: '#6398FF',
      fontSize: 28,
      marginTop: 12,
      display: 'inline-block'
    },
    [theme.breakpoints.down('xs')]: {
      btnGroup: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
          padding: '15px 25px',
          width: '130px'
        }
      }
    },
    poolErrorBuyWarning: {
      marginTop: 25,
      fontWeight: 'bold',
      color: '#fff100',
      fontSize: 15
    },
    poolErrorBuy: {
      marginTop: 25,
      fontWeight: 'bold',
      fontSize: 15,
      color: '#D01F36'
    },
    purchasableCurrency: {
      display: 'flex',
      alignItems: 'center'
    },
    purchasableCurrencyIcon: {
      width: 30,
      height: 30,
      marginRight: 7 
    },
    purchasableCurrencyMax: {
      padding: '5px 10px',
      marginRight: 20,
      backgroundColor: 'rgb(50, 50, 220)',
      border: 'none',
      color: 'white',
      borderRadius: 5,
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: '.2s all ease-in',

      '&:hover': {
        opacity: '.9'
      },

      '&:focus': {
        outline: 'none'
      },

      '&:active': {
        transform: 'translateY(-3px)'
      }
    }
  };
});

export default useStyles;
