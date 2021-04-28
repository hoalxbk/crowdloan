import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    btnGroup: {
      marginTop: 40,

      '& button:first-child': {
        marginRight: 10
      },
      
      '& button': {
        padding: '0 25px',
        width: '130px',
        height: '42px',
        font: 'normal normal bold 14px/18px DM Sans'
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
      marginBottom: 20,
      lineHeight: '24px',
      font: 'normal normal bold 14px/18px DM Sans',
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
      font: 'normal normal normal 14px/24px Helvetica',
      '&:focus': {
        outline: 'none'
      }
    },
    buyTokenInputLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#999999',
      font: 'normal normal normal 12px/18px Helvetica'
    },
    buyTokenFee: {
      color: '#999999',
      marginTop: 10,
      font: 'normal normal normal 12px/18px Helvetica'
    },
    buyTokenEstimate: {
      marginTop: 32
    },
    buyTokenEstimateLabel: {
      font: 'normal normal bold 14px/18px DM Sans'
    },
    buyTokenEstimateAmount: {
      color: '#6398FF',
      marginTop: 12,
      display: 'inline-block',
      font: 'normal normal bold 28px/32px DM Sans'
    },
    [theme.breakpoints.down('xs')]: {
      btnGroup: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
          padding: '15px 25px',
          width: '130px',
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
      alignItems: 'center',
      font: 'normal normal bold 14px/18px DM Sans'
    },
    purchasableCurrencyIcon: {
      width: 30,
      height: 30,
      marginRight: 7 
    }
  };
});

export default useStyles;
