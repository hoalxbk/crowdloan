import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 720,
    margin: '0 auto',
  },
  containerCreateEdit: {
    maxWidth: 720,
    // margin: '0 auto',
  },
  form: {
    backgroundColor: 'white',
    boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.1)`,
    borderRadius: 10,
    padding: '50px 25px',
    marginTop: 25
  },
  formControl: {
    marginTop: 30,
    position: 'relative',
  },
  formControlFlex: {
    marginTop: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  formCKEditor: {
    // minHeight: 300,
    // height: 300,
  },
  formControlLabel: {
    fontSize: 14,
    letterSpacing: '0.25px',
    color: '#363636'
  },
  formControlBlurLabel: {
    color: '#9A9A9A !important'
  },
  formControlInput: {
    display: 'block',
    border: '1px solid #DFDFDF',
    width: '100%',
    padding: '13px',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: 'white',
    transition: '.1s all ease-in',

    '&:focus': {
      borderColor: '#FFCC00',
      outline: 'none'
    }
  },
  formControlInputLoading: {
    position: 'relative'
  },
  formControlIcon: {
    display: 'inline-block',
    marginTop: 10
  },
  formDatePicker: {
    maxWidth: 300,
    width: 300,
    marginTop: 5,
    border: '1px solid #DFDFDF',
    borderRadius: 5,
    position: 'relative',

    '& .react-date-picker__wrapper': {
      backgroundColor: 'white !important',
    }
  },
  formDatePickerBlock: {
    display: 'block'
  },
  formControlFlexBlock: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  // for exchange rate section
  exchangeRate: {
    backgroundColor: 'white',
    boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.1)`,
    borderRadius: 10,
    padding: '20px 25px 30px 25px',
    marginTop: 20
  },
  exchangeRateTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#363636'
  },
  exchangeRateDesc: {
    marginTop: 30,
    color: '#9A9A9A',
    letterSpacing: '0.25px'
  },
  formControlRate: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    marginTop: 5,
  },
  formInputBox: {
    border: '1px solid #DFDFDF',
    padding: '13px',
    maxWidth: 300,
    width: 250,
    fontSize: 14,
    borderRadius: 5,
    'border-top-right-radius': 0,
    'border-bottom-right-radius': 0,

    '&:focus': {
      outline: 'none'
    }
  },
  formInputBoxEther: {
    border: '1px solid #000000 !important',
  },
  formInputBoxBS: {
    backgroundColor: '#DFDFFF',
    color: '#3A39BB'
  },
  box: {
    right: 0,
    top: 0,
    width: 50,
    height: 44,
    backgroundColor: '#000000',
    fontSize: 14,
    color: 'white',
    border: 'none',
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    'border-top-right-radius': 5,
    'border-bottom-right-radius': 5,
    padding: 5
  },
  boxEther: {
    backgroundColor: '#3A39BB'
  },
  formButton: {
    backgroundColor: '#FFCC00',
    boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
    borderRadius: 10,
    padding: '14px 0px',
    border: 'none',
    display: 'inline-block',
    width: '100%',
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
    marginTop: 25,
    marginBottom: 60,
    cursor: 'pointer',
    transition: '.2s all ease-in',

    '&:hover': {
      boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
      transform: 'translateY(-7px)'
    },
    '&:focus': {
      outline: 'none'
    }
  },

  formButtonDeployed: {
    backgroundColor: '#9A9A9A',
    boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
    borderRadius: 10,
    padding: '14px 0px',
    border: 'none',
    display: 'inline-block',
    width: '45%',
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
    marginTop: 25,
    marginBottom: 60,
    marginLeft: 10,
    marginRight: 10,
    cursor: 'not-allowed',

    // transition: '.2s all ease-in',
    // '&:hover': {
    //   boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
    //   transform: 'translateY(-7px)'
    // },
    // '&:focus': {
    //   outline: 'none'
    // }
  },

  formButtonDeploy: {
    backgroundColor: '#FFCC00',
    boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
    borderRadius: 10,
    padding: '14px 0px',
    border: 'none',
    display: 'inline-block',
    width: '45%',
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
    marginTop: 25,
    marginBottom: 60,
    marginLeft: 10,
    marginRight: 10,
    cursor: 'pointer',
    transition: '.2s all ease-in',

    '&:hover': {
      boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
      transform: 'translateY(-7px)'
    },
    '&:focus': {
      outline: 'none'
    }
  },

  formButtonUpdatePool: {
    backgroundColor: '#FFCC00',
    boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
    borderRadius: 10,
    padding: '14px 0px',
    border: 'none',
    display: 'inline-block',
    width: '45%',
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
    marginTop: 25,
    marginBottom: 60,
    marginLeft: 10,
    marginRight: 10,
    cursor: 'pointer',
    transition: '.2s all ease-in',

    '&:hover': {
      boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
      transform: 'translateY(-7px)'
    },
    '&:focus': {
      outline: 'none'
    }
  },

  formErrorMessage: {
    marginTop: 7,
    color: 'red',
  },
  formErrorMessageAbsolute: {
    position: 'absolute',
    bottom: '-20px'
  },
  tokenInfo: {
    marginTop: 15,
    padding: '20px 15px',
    backgroundColor: '#F0F0F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,

    '& > .tokenInfoBlock': {
      color: '#363636',
      textAlign: 'left'
    },

    '& .tokenInfoLabel': {
      fontSize: 14,
      color: '#636363'
    },

    '& .wordBreak': {
      width: 150,
      maxWidth: 150,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },

    '& .tokenInfoContent': {
      marginTop: 7,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center'
    },

    '& .tokenInfoText': {
      marginLeft: 15
    }
  },
  loadingTokenIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)'
  },
  circularProgress: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)'
  }
}))

export default useStyles
