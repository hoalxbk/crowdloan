import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    poolDetailClaim: {
      marginTop: 20,
      padding: '20px 40px',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8
    },
    poolDetailClaimTitle: {
      '& span': {
        marginRight: 20,
        color: '#999999',
      }
    },
    poolDetailClaimInfo: {
      marginTop: 30,
      marginBottom: 40
    },
    poolDetailClaimInfoBlock: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',

      '&:not(:first-child)': {
        marginTop: 25
      },
      '& span': {
        color: '#999999'
      }
    },
  };
});

export default useStyles;
