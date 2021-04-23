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
      marginTop: 30
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
    minimumBuyWarning: {
      marginTop: 25,
      fontWeight: 'bold',
      color: '#fff100',
      fontSize: 15
    }
  };
});

export default useStyles;
