import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    tierInfomation: {
      marginTop: "40px"
    },
    tierNote: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
      border: '1px solid #fff',
      padding: '20px',
      '& span, & h2': {
        color: '#fff'
      }
    },
    conversionRate: {
      display: 'flex',
      flexDirection: 'column',
      width: '300px',
      '& .group': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      '& span, & h2': {
        color: '#fff'
      }
    }
  };
});

export default useStyles;
