import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    groupShow: {
      marginTop: 40
    },
    groupShowCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    groupShowSpacing: {
      marginTop: 30
    }
  }
});

export default useStyles;
