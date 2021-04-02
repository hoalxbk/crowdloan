import { makeStyles } from '@material-ui/core';
import { NONAME } from 'dns';

const useCommonStyle = makeStyles((theme) => {
  return {
    DefaultLayout: {
      display: 'flex',
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
    }
  };
});

export default useCommonStyle;
