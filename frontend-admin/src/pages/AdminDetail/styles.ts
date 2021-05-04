import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    buyStatus: {
      color: 'white',
      fontWeight: 700,
      padding: '5px 15px',
      borderRadius: 5,
      display: 'inline-block',
      fontFamily: 'Roboto-Bold',
      textTransform: 'uppercase',
      fontSize: 14,
      width: '77%',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      textAlign: 'center'
    },
    buyWithEther: {
      backgroundColor: '#00a65a',
    },
    buyWithToken: {
      backgroundColor: '#00c0ef',
    },
    buyWithEtherWithETHLink: {
      backgroundColor: '#f39c12',
    },
    refund: {
      backgroundColor: '#00c0ef',
    },
    claimed: {
      backgroundColor: '#FF4C00',
    },
    headPage: {

    },
    boxCampaignDetail: {
      borderRadius: 10,
      marginBottom: 20,
    },
    headBoxCampaignDetail: {
      background: '#FFCC00',
      borderRadius: '10px 10px 0px 0px',
      height: 54,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',

      '& .campaign-active': {
        color: '#56b022',
      },
      '& .campaign-active::after': {
        backgroundColor: '#56b022'
      },
      '& .campaign-suspend': {
        color: 'red',
      },
      '& .campaign-suspend::after': {
        backgroundColor: 'red'
      },
    },
    campaignDetailStatus: {
      position: 'absolute',
      top: '50%',
      left: 70,
      transform: 'translateY(-50%)',
      fontWeight: 500,

      '&::after': {
        content: '""',
        position: 'absolute',
        left: '-20px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 10,
        height: 10,
        borderRadius: '50%',
      }
    },
    btnEdit: {
      width: 24,
      height: 24,
      minWidth: 24,
      position: 'absolute',
      top: '50%',
      right: 14,
      marginTop: -12,
    },
    titleBoxCampaignDetail: {
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '26px',
      color: '#FFFFFF',
      fontFamily: 'Roboto-Bold',
    },
    formShow: {
      padding: '24px 50px',
      backgroundColor: 'white',
      borderRadius: 10,
      'border-top-left-radius': 0,
      'border-top-right-radius': 0,
      boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)'
    },
    groupShow: {
      marginBottom: 15,
    },
    groupShowCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    groupShowSpacing: {
      marginTop: 30
    },
    groupShowLabelCenter: {
      textAlign: 'center',
      color: '#FF4C00',
      fontSize: 14,
      marginBottom: 12
    },
    groupShowTime: {
      marginBottom: 30,
      marginRight: 20,
      display: 'inline-block',
      float: 'left',
    },
    lineTime: {
      display: 'inline-block',
      width: 12,
      height: 1,
      background: '#9A9A9A',
      float: 'left',
      marginRight: 20,
      position: 'relative',
      top: 34,
    },
    lineTimeEdit: {
      display: 'inline-block',
      width: 12,
      height: 1,
      background: '#9A9A9A',
      float: 'left',
      marginRight: 20,
      position: 'relative',
      top: 43,
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
    nameGroupShowFlex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    valueGroupShow: {
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#636363',
      width: '100%',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    valueGroupShowFlex: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    valueGroupShowFlexIcon: {
      cursor: 'pointer',
      fontSize: 30,
      fill: '#FFCC00'
    },
    valueGroupShowCopy: {
      backgroundColor: '#F0F0F0',
      padding: '4px 0px 4px 10px',
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    valueGroupShowCopyIcon: {
      transition: '.2s all ease-in',
      color: '#636363',

      '&:hover': {
        backgroundColor: 'transparent',
        transform: 'translateY(-3px)'
      }
    },
    valueGroupShowTooltip: {
      fontSize: 13
    },
    valueGroupTransaction: {
      backgroundColor: '#ffe57f',
      color: '#636363',
    },
    tokenInfo: {
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
    coinLeft: {
      '& span': {
        fontWeight: 700,
        marginRight: 10,
        fontSize: 30
      },
      fontSize: 26
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
      justifyContent: 'space-between'
    },
    itemCoin: {
      width: '40%',
      display: 'flex',
      flexFlow: 'wrap',
      fontSize: 14
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
    formControlBlurLabel: {
      color: '#9A9A9A !important'
    },
    formControlInput: {
      display: 'block',
      border: '1px solid #DFDFDF',
      width: '100%',
      padding: '13px',
      borderRadius: 5,
      marginTop: 10,
      backgroundColor: 'white',
      transition: '.1s all ease-in',

      '&:focus': {
        borderColor: '#FFCC00',
        outline: 'none'
      }
    },
    formControlIcon: {
      display: 'inline-block',
      marginTop: 10
    },
    affiliateYes: {
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#00AF12',
      display: 'flex',
      alignItems: 'center',

      '& .icon': {
        display: 'inline-block',
        width: 24,
        height: 24,
        maskImage: `url('/images/icon_check.svg')`,
        backgroundColor: '#00AF12',
        marginRight: 3,
      }
    },
  formControlRate: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    marginTop: 5,
  },
  formControlFlexBlock: {
    display: 'flex',
    flexDirection: 'column'
  },
  formInputBox: {
    border: '1px solid #DFDFDF',
    padding: '13px',
    maxWidth: 200,
    width: 200,
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
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    'border-top-right-radius': 5,
    'border-bottom-right-radius': 5,
    padding: 5
  },
  boxEther: {
    backgroundColor: '#3A39BB'
  },
    affiliateNo: {
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#636363',
      display: 'flex',
      alignItems: 'center',

      '& .icon': {
        display: 'inline-block',
        width: 24,
        height: 24,
        maskImage: `url('/images/icon_close.svg')`,
        backgroundColor: '#636363',
        marginRight: 3,
      }
    },
    affiliateNotRegister: {
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#636363',
      display: 'flex',
      alignItems: 'center',

      '& .icon': {
        display: 'inline-block',
        width: 24,
        height: 24,
        maskImage: `url('/images/icon_not_check.svg')`,
        backgroundColor: '#636363',
        marginRight: 3,
      }
    },
    groupShowRate: {
      display: 'flex',
    },
    groupRate: {
      width: 'calc((100% - 55px) / 2)'
    },
    nameGroupRate: {
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#636363',
      marginBottom: 8,
      display: 'flex',
    },
    boxInputGroupRate: {
      position: 'relative',
      display: 'block',
      background: 'rgb(32 32 32 / 10%)',
      borderRadius: 5,
      overflow: 'hidden',

      '& input': {
        border: 'none',
        boxShadow: 'none',
        background: 'transparent',
        outline: 'none',
        height: 40,
        padding: '10px 40px 10px 15px',
        display: 'block',
        width: '100%',
      },

      '& .unit': {
        width: 50,
        height: 40,
        lineHeight: '40px',
        textAlign: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
      }
    },
    iconTransfer: {
      margin:' 0px 20px',
      height: 15,
      marginTop: 40,
    },
    groupInput: {
      marginBottom: 30,
    },
    inputNumeric: {
     '&[type=number]': {
        '-moz-appearance': 'textfield',
      },
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
    inputLabel: {
      fontSize: 14,
      lineHeight: '22px',
      display: 'flex',
      letterSpacing: 0.1,
      color: '#363636',
      fontFamily: 'Roboto-Bold',
      marginBottom: 2,
    },
    inputG: {
      height: 40,
      border: '1px solid #DFDFDF',
      borderRadius: 5,
      width: '100%',
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#636363',
      padding: '10px 15px',
    },
    boxInputGroupRateYouGet: {
      position: 'relative',
      display: 'block',
      background: 'transparent',
      border: '1px solid #DFDFDF',
      borderRadius: 5,
      overflow: 'hidden',

      '&.for': {
        background: '#DFDFFF',
        border: '1px solid #DFDFFF',

        '& .unit': {
          background: '#3A39BB',
        }
      },

      '& input': {
        border: 'none',
        boxShadow: 'none',
        background: 'transparent',
        outline: 'none',
        height: 40,
        padding: '10px 40px 10px 15px',
        display: 'block',
        width: '100%',
      },

      '& .unit': {
        fontSize: 14,
        letterSpacing: 0.25,
        color: '#FFFFFF',
        width: 50,
        height: 40,
        lineHeight: '40px',
        textAlign: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        background: '#000000',
      }
    },
    registerAffiliate: {
      fontSize: 14,
      letterSpacing: 0.25,
      color: '#FFCC00',
      lineHeight: '20px',
      textDecoration: 'underline',
      '&:hover': {
        color: '#FFCC00',
      }
    },
    listBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnSubmit: {
      background: '#FFCC00',
      boxShadow: '0px 0px 15px rgba(243, 203, 25, 0.3)',
      borderRadius: 8,
      height: 40,
      minWidth: 92,
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 160,
      alignItems: 'center',
      color: '#FFFFFF',
      textTransform: 'inherit',
      fontFamily: 'Roboto-Bold',
      overflow: 'hidden',
      marginRight: 20,
      '&:hover': {
        background: '#FFCC00',
      }
    },
    btnCancel: {
      background: '#636363',
      boxShadow: '0px 0px 15px rgb(0 0 0 / 10%)',
      borderRadius: 8,
      height: 40,
      minWidth: 92,
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 160,
      alignItems: 'center',
      color: '#FFFFFF',
      textTransform: 'inherit',
      fontFamily: 'Roboto-Bold',
      overflow: 'hidden',
      '&:hover': {
        background: '#636363',
      }
    },
    boxGenerateYourLink: {
      background: '#FFFFFF',
      boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      marginBottom: 20,
      marginTop: 20
    },
    btnGenerateYourLink: {
      background: '#FFCC00',
      border: '1px solid #F0F0F0',
      borderRadius: '0px 10px',
      height: 30,
      fontSize: 14,
      lineHeight: '16px',
      color: '#FFFFFF',
      fontFamily: 'Roboto-Bold',
      float: 'right',
      textTransform: 'initial',
      '&:hover': {
        background: '#FFCC00',
      }
    },
    btnViewMore: {
      textTransform: 'initial',
      lineHeight: '16px',
      height: 30,
      color: '#FFCC00',
      fontFamily: 'Roboto-Bold',
      margin: '14px auto',
      display: 'block',
      background: 'transparent',
      paddingTop: 3,
      '& .icon': {
        display: 'inline-block',
        width: 18,
        height: 18,
        maskImage: `url('/images/icon-plus.svg')`,
        backgroundColor: '#FFCC00',
        position: 'relative',
        top: 4,
        marginRight: 6,
      }
    },
    tableGenerateYourLink: {
      boxShadow: 'none',
      padding: 18,
      borderRadius: 10
    },
    TableCellHead: {
      fontSize: 14,
      lineHeight: '22px',
      letterSpacing: 0.1,
      color: '#363636',
      fontFamily: 'Roboto-Bold',
      padding: 5,
    },
    TableRowBody: {
      borderRadius: 5,
      '&:nth-of-type(even)': {
        background: 'rgb(32 32 32 / 5%)',
      }
    },
    TableCellBody: {
      fontSize: 14,
      padding: 5,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: '#636363',
      borderBottom: 'none',
    },
    TableCellBodyFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    linkIcon: {
      cursor: 'pointer'
    },
    linkIconTooltip: {
      fontSize: 14
    },
    titleTable: {
      background: '#202020',
      borderRadius: '10px 10px 0px 0px',
      fontSize: 16,
      lineHeight: '26px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      color: '#FFFFFF',
      height: 54,
      justifyContent: 'center',
      fontFamily: 'Roboto-Bold',
    },
    rightPage: {
      background: '#FFFFFF',
      borderRadius: 10,
    },
    tableTransactionList: {
      padding: 18,
      boxShadow: 'none',
      borderRadius: 10
    },
    boxPagination: {
      padding: 18,
      display: 'flex',
      justifyContent: 'center',

      '& .MuiPaginationItem-page.Mui-selected': {
        background: '#FFCC00',
        color: '#363636',
      }
    },
    skeleton: {
      padding: '25px 0px',
      marginTop: 10
    },
    skeletonLoading: {
      padding: 10
    },
    registerButton: {
      padding: '10px',
      backgroundColor: '#FFCC00',
      color: 'white',
      border: '1px solid #F0F0F0',
      borderRadius: 5,
      fontWeight: 600,
      fontSize: 15,
      cursor: 'pointer',
      transition: '.2s all ease-in',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      textTransform: 'capitalize',

      '&:hover': {
        transform: 'translateX(3px)',
        boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
        color: '#4A4A4A',
      },

      '&:focus': {
        outline: 'none'
      },

      '&.suspend': {
        backgroundColor: '#F36263',

        '&:hover': {
          transform: 'translateX(-3px)',
          color: 'white'
        }
      },

      '&.active': {
        backgroundColor: '#56b022',

        '&:hover': {
          transform: 'translateX(-3px)',
          color: 'white'
        }
      },

      '&.absolute': {
        position: 'absolute',
        // top: '50%',
        // transform: 'translateY(-50%)',
        display: 'flex',
        height: '80%',
        borderRadius: 0,
        'border-top-right-radius': 10,
        right: '0px',
        padding: '7px 10px',
        backgroundColor: '#ffe57f',
        color: '#636363',
        borderColor: 'transparent',
        'border-bottom-left-radius': 10,
        top: 0,

        '&:hover': {
          transform: 'none',
          color: 'black'
        }
      }

    },
    registerButtonWithLeft: {
      marginLeft: 30
    },
    registerButtonIcon: {
      marginLeft: 5
    },
    usdtSetButton: {
      marginLeft: 0,
      marginTop: 10
    },
    buyButton: {
      marginLeft: 0,
      marginTop: 10,
      width: '100%',
      padding: '15px 0px',
      borderRadius: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '&:hover': {
        backgroundColor: '#FFCC00',
        transform: 'translateY(-3px)'
      }
    },
    buttonText: {
      marginRight: 10,
      fontSize: 18
    },
    buttonIcon: {
      padding: 4,
      backgroundColor: '#FEDC00',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 25,
      height: 25
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
      marginTop: 10,
      // textAlign: 'center',
      fontSize: 15,
      color: 'red'
    },
    errorMessageAbsolute: {
      position: 'absolute',
      bottom: '-18px',
      color: 'red'
    },
    noDataMessage: {
      fontWeight: 500,
      marginTop: 30,
      textAlign: 'center',
      fontSize: 15,
    },
    pagination: {
      marginTop: 30,
      fontSize: 12,
      fontWeight: 400,
      '& .MuiPagination-ul': {
        justifyContent: 'center',
      },
      '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#FFCC00'
      }
    },
    wordBreak: {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: 120
    },
    formDatePicker: {
      border: '1px solid #DFDFDF',
      borderRadius: 5,
      position: 'relative',
      marginTop: 20,

      '& .react-date-picker__wrapper': {
        backgroundColor: 'white !important',
      }
    },
    datePicker: {
      '& .react-datetime-picker__calendar--open': {
        left: 'unset !important' as any,
        top: '150% !important' as any,
        bottom: '0 !important' as any,
      },
      '& .react-datetime-picker__clock--open': {
        top: '150% !important' as any,
        bottom: '0 !important' as any,
      },

      '& .react-clock': {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '130px !important' as any,
        height: '130px !important' as any
      }
    }
  };
});

export default useStyles;
