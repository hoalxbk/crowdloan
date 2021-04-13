import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    listPools: {
      padding: '0 80px',
      marginTop: '120px',

      '& h2': {
        textAlign: 'center',
        marginBottom: '30px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '28px',
        lineHeight: '32px',
        color: '#FFFFFF',
      },

      '& .pools': {
        display: 'Grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '20px'
      },

      '& .btn': {
        height: '42px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 27px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
        backgroundColor: '#D01F36',
        margin: '40px auto 0'
      }
    },
    getAlert: {
      padding: '118px 80px 94px 80px',
      position: 'relative',

      '& > img': {
        width: '100%',
      },

      '& .content': {
        position: 'absolute',
        zIndex: 1,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      },

      '& h2': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '48px',
        lineHeight: '66px',
        color: '#FFFFFF',
        textAlign: 'center'
      },

      '& p': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#999999',
        textAlign: 'center'
      },

      '& .btn': {
        backgroundColor: '#3232DC',
        height: '42px',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 27px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
        margin: '40px auto 0'
      }
    }
  };
});

export default useStyles;
