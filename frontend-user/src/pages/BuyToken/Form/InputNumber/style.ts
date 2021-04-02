import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    inputNumber: {
      height: '70px',
      border: '1px solid #DFDFDF',
      padding: '12px 15px',
      borderRadius: '5px',
      '&__label': {
        display: 'block',
        fontSize: '12px',
        letterSpacing: '0.4px',
        color: '#9A9A9A',
      },
      '&__input': {
        width: '100%',
        height: '30px',
        maxWidth: '100%',
        letterSpacing: '0.4px',
        color: theme.custom.colors.secondaryText,
        border: 0,
        outline: 'none',
        fontWeight: 'bold',
        fontSize: '20px',
      }
    }
  };
});

export default useStyles;
