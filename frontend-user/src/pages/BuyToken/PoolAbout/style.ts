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
      alignItems: 'center'
    },
    PoolAboutIcon: {
      marginLeft: 10
    },
    PoolAboutDesc: {
      width: 580, 
      marginTop: 25,
      lineHeight: '1.6rem' ,
      color: '#999999'
    }
  };
});

export default useStyles;
