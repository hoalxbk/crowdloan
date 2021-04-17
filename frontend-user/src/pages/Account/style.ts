import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    errorBanner: {
      color: 'white',
      backgroundColor: '#FF4C00',
      textAlign: 'center',
      padding: 12,
      marginBottom: 0,
      flex: 1,
    },
    accountContainer: {
      display: 'grid',
      gridTemplateColumns: '5fr 4fr',
      gap: '100px',
      padding: '80px',
      marginTop: '40px',
      marginBottom: '120px',
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        padding: '40px',
        marginTop: '120px',
      },
      [theme.breakpoints.only('xs')]: {
        gridTemplateColumns: '1fr',
        padding: '20px',
      },
    },
    leftPanel: {
    },
    rightPanel: {
      maxWidth: '100%',
      width: '100%'
    }
  };
});

export default useStyles;
