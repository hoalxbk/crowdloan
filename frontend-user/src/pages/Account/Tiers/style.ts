import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '20px',

      '& p': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '24px',
        color: '#999999',
        marginLeft: '10px',
      }
    },
    tierList: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',

      '&::before': {
        content: '""',
        display: 'block',
        width: '100%',
        height: '5px',
        position: 'absolute',
        top: '11.5px',
        left: '0',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },

      '& li.process': {
        display: 'block',
        height: '5px',
        position: 'absolute',
        top: '11.5px',
        left: '0',
        backgroundColor: '#232394',
        zIndex: 1
      }
    },
    tierInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,

      '& div': {
        marginBottom: '15px',
        width: '28px',
        height: '28px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232394',
        borderRadius: '50%',

        '& img.active': {
          opacity: 1
        },

        '& img': {
          opacity: 0.7
        },
      },

      '&:last-child': {
        alignItems: 'flex-end'
      },

      '&:first-child': {
        alignItems: 'flex-start'
      },

      '& .tier-name.active': {
        opacity: 1,
      },

      '& span': {
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '18px',
        color: '#FFFFFF',
        opacity: 0.4,
      }
    }
  };
});

export default useStyles;
