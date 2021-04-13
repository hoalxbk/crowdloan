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
    changeTier: {
      width: '440px'
    },
    accountContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 440px',
      gap: '100px',
      padding: '80px'
    },
    leftPanel: {
    },
    rightPanel: {
    }
  };
});

export default useStyles;
