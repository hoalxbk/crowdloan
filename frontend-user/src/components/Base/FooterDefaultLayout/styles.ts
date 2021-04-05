import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    footer: {
      gridArea: 'footer',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 80px',
      backgroundColor: '#020618'
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr',
      gap: '20px',
      padding: '60px 20px'
    },
    infoRedKite: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Helvetica',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      color: '#999999',
    },
    logo: {
      marginBottom: 15
    },
    shareLink: {
      marginTop: 15
    },
    teleGram: {

    },
    twitter: {

    },
    facebook: {

    },
    github: {

    },
    infoCompany: {
      paddingTop: '60px',
    },
    companyLink: {
      display: 'flex',
      flexDirection: 'column',
    },
    help: {
      paddingTop: '60px',
    },
    helpLink: {
      display: 'flex',
      flexDirection: 'column',
    },
    developers: {
      paddingTop: '60px',
    },
    developerLink: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '18px',
      lineHeight: '24px',
      color: '#FFFFFF',
    },
    link: {
      fontFamily: 'Helvetica',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '32px',
      color: '#999999',
    },
    endContent: {
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      height: '50px',
      width: '100%'
    },
    copyRight: {
      textAlign: 'center',
      fontFamily: 'Helvetica',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '50px',
      color: '#666666',
    },
  };
});

export default useStyles;
