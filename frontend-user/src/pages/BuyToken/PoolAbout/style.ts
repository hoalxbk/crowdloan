import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    PoolAbout: {
      marginTop: 30
    },
    PoolAboutBlock: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',

      '&:not(:first-child)': {
        marginTop: 25
      }
    },
    PoolAboutLabel: {
      color: '#999999'
    },
    PoolAboutText: {
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        lineHeight: '20px',
        wordBreak: 'break-all'
      }
    },
    PoolAboutIcon: {
      marginLeft: 10
    },
    PoolAboutDesc: {
      width: 580, 
      marginTop: 25,
      lineHeight: '1.6rem' ,
      color: '#999999', 

      [theme.breakpoints.down('xs')]: {
        width: '100%'
      }
    }
  };
});

export default useStyles;
