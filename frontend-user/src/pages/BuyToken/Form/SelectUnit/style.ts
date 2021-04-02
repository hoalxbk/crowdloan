import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    selectUnit: {
      height: '70px',
      border: '1px solid #DFDFDF',
      padding: '12px 15px',
      borderRadius: '5px',
      position: 'relative',
      width: '112px',
      cursor: 'pointer',
      '&__text': {
        '& svg': {
          position: 'absolute',
          top: '50%',
          right: '5px',
          transform: 'translateY(-50%)',
        }
      },
      '&__value': {
        fontWeight: 'bold',
        fontSize: '20px',
        textTransform: 'uppercase',
        width: '80px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '&__label': {
        display: 'block',
        fontSize: '12px',
        letterSpacing: '0.4px',
        color: '#9A9A9A',
        width: '80px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '&__options': {
        position: 'absolute',
        top: '100%',
        left: '0',
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
        border: '1px solid #DFDFDF',
        'zIndex': '1',
      },
      '&__item': {
        padding: '10px 15px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        '&.active': {
          backgroundColor: theme.custom.colors.primary,
          color: '#fff',
        }
      }
    }
  };
});

export default useStyles;
