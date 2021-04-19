import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    dialog: {
      '& .MuiPaper-root': {
        background: '#020616',
        padding: 40,
        maxWidth: 900
      }
    },
    dialogContentTypo: {
      color: 'white',
      fontSize: 16,
      marginTop: 40,
      fontWeight: 700,

      '&:first-child': {
        marginTop: 0
      }
    },
    dialogContentBlock: {
      marginTop: 20,
    },
    dialogTitle: {
      '& .MuiTypography-h6': {
        fontSize: 28,
        fontWeight: 700,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255, 255, 255 ,0.1)',
      },

      '& .MuiSvgIcon-root': {
        fontSize: '1rem'
      }
    },
    dialogPrivacy: {
      display: 'flex',
      alignItems: 'center'
    },
    dialogPrivacyText: {
     fontSize: 16 
    },
    dialogPrivacyHighlight: {
      color: '#3C5EA2'
    },
    dialogCheckbox: {
      padding: 0,
      marginRight: 8,

      '& .MuiSvgIcon-root': {
        fill: 'white'
      }
    },
    dialogNetworks: {
      display: 'flex'
    },
    [theme.breakpoints.down('xs')]: {
      dialog: {
        '& .MuiPaper-root': {
          background: '#020616',
          padding: '20px',
          margin: '20px',
          maxWidth: '100%',
          width: '100%',
        },
      },
      dialogContentBlock: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        '& .MuiPaper-root': {
          padding: '20px 0'
        }
      },
      dialogPrivacy: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0,
      }
    }
  };
});

export default useStyles;
