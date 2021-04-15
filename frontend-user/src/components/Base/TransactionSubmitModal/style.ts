import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    dialog: {
      '& .MuiPaper-root': {
        background: '#020616',
        padding: 60,
        maxWidth: 540,
        width: 540,
        textAlign: 'center'
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
    dialogInput: {
      width: '100%',
      padding: '8px 15px',
      marginTop: 15,
      background: '#11152A',
      borderRadius: 4,
      border: 'none',
      color: 'white',
      fontSize: 15,
      fontWeight: 400,

      '&:focus': {
        outline: 'none',
        color: 'white'
      }
    },
    dialogButton: {
      marginTop: 25,
      display: 'inline-block',
      width: '100%',
      background: '#3232DC',
      borderRadius: 60,
      padding: '15px 0px',
      color: 'white',
      border: 'none',
      fontWeight: 700,
      fontSize: 15,
      cursor: 'pointer',
      transition: '.2s all ease-out',

      '&:focus': {
        outline: 'none'
      },

      '&:hover': {
        opacity: .8,
        color: 'white'
      },

      '&:active': {
        transform: 'translateY(-3px)'
      },
    }
  };
});

export default useStyles;
