import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    poolDetailClaim: {
      marginTop: 20,
      padding: '20px 40px',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8,
      width: '60%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [theme.breakpoints.down('xs')]: {
        width: '100%',
        '& #countdown': {
          marginTop: 30
        },
        '& ul': {
          textAlign: 'center'
        },
        '& button': {
          width: '100%'
        }
      }
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
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr 1fr'
      },

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
