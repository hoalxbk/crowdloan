import { makeStyles } from '@material-ui/core';
import { NONAME } from 'dns';

const useCommonStyle = makeStyles((theme) => {
  return {
    DefaultLayout: {
      height: '100vh',
  
      /* grid container settings */
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto 1fr auto',
      gridTemplateAreas: 
        `'header'
        'main'
        'footer'`,
    },
    headPage: {
      display: 'flex',
      marginBottom: 25,
    },
    headPageLeft: {

    },
    headPageRight: {
      marginLeft: 'auto',
      display: 'flex',
    },
    btnBack: {
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
      '&:hover': {
        background: '#FFCC00',
      }
    },
    TimePicker: {
      '& .react-time-picker__wrapper': {
        background: '#F0F0F0',
        borderRadius: 8,
        border: 'none',
        height: 40,
        padding: '5px 10px',
      },
      '& .react-time-picker__inputGroup': {
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: '#9A9A9A',
        '& input': {
          outline: 'none',
          border: 'none',
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.25px',
          color: '#9A9A9A',
        }
      },
      '& .react-time-picker__button': {
        padding: 5,
        outline: 'none',
        border: 'none',

        '& svg': {
          width: 16,
          stroke: '#9A9A9A',
        }
      },
      '& .react-time-picker__inputGroup__input': {
        outline: 'none',
        border: 'none',
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: '#9A9A9A',
      }
    },
    DatePicker: {
      '& .react-date-picker__wrapper': {
        background: '#F0F0F0',
        borderRadius: 8,
        border: 'none',
        height: 40,
        padding: '5px 10px',
      },
      '& .react-date-picker__inputGroup': {
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: '#9A9A9A',
        '& input': {
          outline: 'none',
          border: 'none',
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.25px',
          color: '#9A9A9A',
        }
      },
      '& .react-date-picker__button': {
        padding: 5,
        outline: 'none',
        border: 'none',

        '& svg': {
          width: 16,
          stroke: '#9A9A9A',
        }
      }
    },
    DateTimePicker: {
      '& .react-datetime-picker__wrapper': {
        background: '#F0F0F0',
        borderRadius: 8,
        border: 'none',
        height: 40,
        padding: '5px 10px',
        color: 'black'
      },
      '& .react-datetime-picker__inputGroup': {
        fontSize: 14,
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: '#9A9A9A',
        '& input': {
          outline: 'none',
          border: 'none',
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.25px',
          color: 'black',
        }
      },
      '& .react-datetime-picker__inputGroup__divider': {
        color: 'black'
      },
      '& .react-datetime-picker__inputGroup__leadingZero': {
        color: 'black'
      },

      '& .react-datetime-picker__button': {
        padding: 5,
        outline: 'none',
        border: 'none',

        '& svg': {
          width: 16,
          stroke: '#9A9A9A',
        }
      }
    },
    iconLine: {
      margin: '0px 8px',
      position: 'relative',
      width: 12,
    },
    boxSearch: {
      position: 'relative',
      marginLeft: 12,
    },
    inputSearch: {
      background: '#F0F0F0',
      borderRadius: 8,
      width: 228,
      maxWidth: '100%',
      height: 40,
      outline: 'none',
      border: 'none',
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: '0.25px',
      color: 'black',
      padding: '10px 15px',
      paddingRight: 40,
    },
    iconSearch: {
      position: 'absolute',
      right: 16,
      top: 12,
    },
    loadingTransaction: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      zIndex: 10,

      '& .content': {
        position: 'relative',
        transform: 'translate(-50%, -50%)',
        top: '45%',
        left: '50%',
        width: '40%',
        padding: '40px 20px',
        background: '#fff'
      },
    },
    modalTransactionInfomation: {
      '& .modal-content__body span': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#FDFDFD',
      },

      '& .modal-content__body': {
        backgroundColor: 'unset!important'
      },

      '& .modal-content__foot button': {
        padding: '12px!important',
        background: 'none'
      }
    },
    modal: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      zIndex: 5,

      '& .modal-content': {
        width: '480px',
        maxHeight: '80%',
        overflow: 'auto',
        padding: '60px',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '40%',
        left: '50%',
        background: '#020616',
        borderRadius: '4px',
      },

      '& .modal-content__head': {
        '& .title': {
          color: '#FFFFFF',
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '14px',
          lineHeight: '18px',
        }
      },

      '& .modal-content__body': {
        borderRadius: '4px',
        padding: '10px 12px',
        margin: '20px 0 32px 0',

        '& .subtitle': {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          color: '#999999',
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '18px',
        },

        '& .input-group': {
          position: 'relative'
        },

        '& .input-group input': {
          width: '100%',
          height: '40px',
          background: 'none',
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '14px',
          lineHeight: '24px',
          color: '#FDFDFD',
          border: 'none',
          outline: 'none',
        },

        '& .input-group .btn-max': {
          width: '50px',
          height: '20px',
          color: '#000',
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '12px',
          lineHeight: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          outline: 'none',
          background: '#FFFFFF',
          padding: '0 12px',
          borderRadius: '1rem',

          '&:hover': {
            cursor: 'pointer'
          },
        },

        '& .input-group span': {
          color: '#000'
        },

        '& .input-group div': {
          position: 'absolute',
          right: '0',
          top: '10px'
        }
      },

      '& .modal-content__foot': {
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        '& button': {
          borderRadius: '60px',
          color: '#FFFFFF',
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '14px',
          lineHeight: '18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          outline: 'none',
          padding: '12px 60px',

          '&:hover': {
            cursor: 'pointer'
          },

          '&:first-child': {
            backgroundColor: '#29C08A'
          },

          '&.btn-cancel': {
            backgroundColor: '#727272'
          }
        }
      }
    },
    nnb2832d: {
      font: 'normal normal bold 28px/32px DM Sans',
    },
    nnb1824d: {
      font: 'normal normal bold 18px/24px DM Sans',
    },
    nnb1624d: {
      font: 'normal normal bold 16px/24px DM Sans',
    },
    nnb1418d: {
      font: 'normal normal bold 14px/18px DM Sans',
    },
    nnb1214d: {
      font: 'normal normal bold 12px/14px DM Sans',
    },
    nnb2432d: {
      font: 'normal normal bold 24px/32px DM Sans',
    },
    nnn1424h: {
      font: 'normal normal normal 14px/24px Helvetica',
    },
    nnn1218h: {
      font: 'normal normal normal 12px/18px Helvetica',
    },
  };
});

export default useCommonStyle;
