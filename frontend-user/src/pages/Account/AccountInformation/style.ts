import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    title: {
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '28px',
      lineHeight: '32px',
      color: '#FFFFFF',
      marginBottom: '30px'
    },
    mainInfomation: {
      margin: '20px 0',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',

      '& span:first-child': {
        minWidth: '100px',
        marginRight: '20px',
        font: 'normal normal normal 14px/24px Helvetica',
        color: '#999999',
      },
      '& span:nth-child(2)': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#FFFFFF',
        width: '100%',
      },
      '& button': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '14px',
        color: '#6398FF',
        mixBlendMode: 'normal',
        minWidth: '120px',
        height: '28px',
        border: '1px solid #6398FF',
        boxSizing: 'border-box',
        borderRadius: '3px',
        background: 'none',
      }
    },
    redKiteInfo: {
      marginTop: '25px',
      '& .kyc-info': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },

      '& .kyc-info span': {
        font: 'normal normal normal 14px/24px Helvetica',
        color: '#999999',
      },
      '& .kyc-info button': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '14px',
        color: '#FFFFFF',
        mixBlendMode: 'normal',
        padding: '7px 11px',
        background: '#D01F36',
        borderRadius: '3px',
        height: '28px',
        border: 'none',
        outline: 'none',

        '&:hover': {
          cursor: 'pointer'
        }
      },
    },
    walletInfo: {
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: '8px',
      width: '100%',
      marginTop: '15px',
      padding: '26px 22px',

      '& p': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#999999',
      },
      '& span': {
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: '28px',
        lineHeight: '32px',
      }
    }
  };
});

export default useStyles;
