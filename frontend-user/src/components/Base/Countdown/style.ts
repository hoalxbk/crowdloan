import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    countdownPart: {
      display: 'inline-block',
      fontSize: '1.5em',
      listStyleType: 'none',
      padding: '.9em',
      color: 'white',

      '& span': {
        display: 'block',
        fontSize: '28px',
        fontWeight: 700,
        textAlign: 'center'
      }
    },
    countdownInfo: {
      color: '#999999',
      fontSize: '14px !important',
      fontWeight: '400 !important' as any
    }
  };
});

export default useStyles;
