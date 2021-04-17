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
    },
    [theme.breakpoints.down('xs')]: {
      countdownPart: {
        padding: '10px 5px',

        '&.number': {
          padding: '5px 5px 15px 5px'
        }
      }
    }
  };
});

export default useStyles;
