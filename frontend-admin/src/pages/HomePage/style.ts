import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  header: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logoutBtn: {
    padding: '13px 20px',
    backgroundColor: '#FFCC00',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',

    '&:focus': {
      outline: 'none'
    }
  },
  logo: {
    display: "flex",
    alignContent: "center",
    color: "#FFCC00",
    fontWeight: 700,
    fontSize: 18,
    '& span': {
      alignSelf: "center",
    },
    '& button': {
      marginLeft: "auto",
      textTransform: "initial",
    }
  },
  container: {
    marginTop: "40px",
    display: "flex",
  },
  leftContainer: {
    width: "40%"
  },
  bannerLeft: {
    display: "flex",
    '& img': {
      width: "40%",
      '& img': {
        width: "100%"
      }
    }
  },
  contentPurchase: {
    width: "60%",
    background: "#FFCC00",
    color: "white",
    padding: "40px",
    '& p': {
      marginTop: "20px",
    },
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
  },
  walletDetail: {
    marginTop: 20,
    backgroundColor: 'white',
    border: '1px solid #F0F0F0',
    boxSizing: 'border-box',
    borderRadius: 10,
    '& .wallet-detail-title': {
      padding: 20,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: '#FBEC51',
      display: 'flex',
      '& span': {
        alignSelf: 'center',
      },
      '& button': {
        fontWeight: 700,
        marginLeft: 'auto',
        color: 'white',
        borderRadius: 30,
        backgroundColor: '#FFCC00',
        'border': '1px solid #FFFFFF',
      }
    },
    '& .wallet-detail-row': {
      display: 'flex',
      padding: 10,
      borderBottom: "1px solid #F0F0F0",
      '& span': {
        alignSelf: 'center',
        display: 'inline-block',
        width: 200,
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      },
      '& img': {
        width: 60
      },
    }
  },
  circleButton: {
    backgroundColor: '#FBEC51 !important',
    borderRadius: '30px !important',
    width: 25,
    height: 25,
    marginLeft: 5,
    '& img': {
      width: 15
    }
  },
  walletRowValue: {
    fontWeight: "bold",
    marginLeft: "auto",
  },
  rightContainer: {
    width: "60%",
    marginLeft: 20,
    color: '#363636',
    display: 'flex',
    flexDirection: 'column',

    '& > div:not(:first-child)': {
      marginTop: 20
    }
  },
  rightContainerBlock: {
    borderRadius: 10,
    background: "white",
   border: "1px solid #F0F0F0",
    boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.1)`,
  },
  createButtonWrap: {
    textAlign: "right",
  },
  buttonCreateNew: {
    backgroundColor: "#FFCC00",
    fontWeight: 700,
    color: "white",
    borderBottomLeftRadius: "10px",
    borderTopRightRadius: "10px",
    display: 'inline-block',
    fontFamily: 'Roboto-Medium',
    '& img': {
      width:'24px',
    }
  },
  buttonGoto: {
    backgroundColor: "#FFCC00",
    fontWeight: 700,
    color: "white",
    borderRadius: 30,
    marginLeft: "auto",
    minWidth: 150,
    '& .iconButton': {
      backgroundColor: '#FEDC00',
      borderRadius: '50%',
      width: 25,
      height: 25,
      display: 'flex',
      justifyContent: 'center',
    },
    '& .MuiButton-label': {
      justifyContent: 'space-between',
      paddingLeft: 20,
    }
  },
  mainContent: {
    padding: '40px 50px',
  },
  date: {
    fontWeight: 500,
    fontSize: 16,
    display: 'flex',
    '& img': {
      marginRight: 10,
    },
  },
  chartTitle: {
    fontWeight: 700,
    fontSize: 16,
    marginTop: 20,
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  coinLeft: {
    '& span': {
      fontSize: 30,
      fontWeight: 700,
      marginRight: 10,
    },
    marginTop: 20,
  },
  coinBar: {
    backgroundColor: '#FEDC00',
    borderRadius: 10,
    height: 20,
    marginTop: 10,
  },
  remainCoinBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #FFCC00 0%, #FF4C00 100%)',
    borderRadius: 100,
    boxShadow: '0px 0px 10px rgba(243, 203, 25, 0,4)'
  },
  descriptionCoinBar: {
    display: 'flex',
    marginTop: 20,
  },
  itemCoin: {
    width: '30%',
    display: 'flex',
    flexFlow: 'wrap',
  },
  leftItemCoin: {
    width: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightItemCoin: {
    width: '75%',
    marginLeft: 'auto',
  },
  coinSold: {
    width: '80%',
    height: 5,
    background: 'linear-gradient(90deg, #FFCC00 0%, #FF4C00 100%)',
    borderRadius: 5,
  },
  coinValue: {
    width: '75%',
    marginLeft: 'auto',
    marginTop: 10,
    fontWeight: 500,
  },
  coinNeedToSold: {
    backgroundColor: '#FEDC00',
    width: '80%',
    height: 5,
    borderRadius: 5,
  },
  leftBottomContainer: {
    width: '40%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
  },
  titleExchangeRate: {
    fontSize: 20,
    fontWeight: 500,
  },
  formInput: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftForm: {
    width: "45%",
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "#000000",
    },
  },
  rightForm: {
    width: "45%",
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "#DFDFFF",
    },
    '& .MuiInputBase-root': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      backgroundColor: "#DFDFFF",
      color: "#3A39BB",
    }
  },
  labelFormWrapper: {
    display: "flex",
    marginTop: 20,
    justifyContent: "space-between"
  },
  labelForm: {
    fontWeight: 400,
    width: "45%",
    color: '#9A9A9A',
    marginBottom: 10,
  },
  inputGroup: {
    display: "flex",
    '& .MuiInputBase-root': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '& .MuiOutlinedInput-input': {
      padding: 10,
    },
  },
  blackHelperInput: {
    backgroundColor: "#000000",
    color: "white",
    alignContent: "center",
    padding: 10,
    alignItems: "center",
    display: "flex",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  purpleHelperInput: {
    backgroundColor: "#3A39BB",
    color: "white",
    alignContent: "center",
    padding: 10,
    alignItems: "center",
    display: "flex",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  formDescription: {
    marginTop: 10,
    color: "#9A9A9A"
  },
  campaignProgressSpace: {
    marginTop: 30
  },
  nameGroupShow: {
    fontSize: 14,
    lineHeight: '22px',
    display: 'flex',
    letterSpacing: 0.1,
    color: '#363636',
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  exchangeRateDesc: {
    marginTop: 30,
    color: '#9A9A9A',
    letterSpacing: '0.25px'
  },
  skeleton: {
    padding: '25px 0px',
    marginTop: 10
  },
  skeletonLoading: {
    padding: 10
  },
    dialog: {
    },
    dialogContent: {
      padding: '8px 24px',
      overflowY: 'initial'
    },
    dialogActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '8px 24px',
      marginTop: 15,

      '& > *:not(:last-child)': {
        marginRight: 5 
      }
    },
    dialogInput: {
      borderRadius: 5,
      border: '1px solid black',
      padding: '10px',
      transition: '.1s all ease-in',

      '&:focus': {
        borderColor: '#FFCC00',
        outline: 'none'
      }
    },
    dialogLabel: {
      marginRight: 10,
      color: '#363636'
    },
    dialogButton: {
      textTransform: 'inherit',
      backgroundColor: '#FFCC00',
      color: 'white',
      fontWeight: 600,

      '&:hover': {
        backgroundColor: '#c29f15'
      }
    },
    dialogButtonCancel: {
      backgroundColor: '#e51d1d',

      '&:hover': {
        backgroundColor: '#a0033b'
      }
    },
    errorMessage: {
      fontWeight: 500,
      marginTop: 30,
      textAlign: 'center',
      fontSize: 15,
      color: 'red'
    },
    formControl: {
      marginTop: 20,
      position: 'relative',

      '& .MuiCircularProgress-root': {
        position: 'absolute',
        right: 10,
        top: '50%',
      }
    },
    formControlFlex: {
      marginTop: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    formControlLabel: {
      fontSize: 14,
      letterSpacing: '0.25px',
      color: '#363636'
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
  formErrorMessage: {
    marginTop: 7,
    color: 'red'
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
    top: '50%'
  },
  loadingIconWrapper: {
    textAlign: 'center',
    padding: '10px 0px'
  }
}))

export default useStyles
