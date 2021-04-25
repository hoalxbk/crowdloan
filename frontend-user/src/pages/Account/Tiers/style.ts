import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    tierComponent: {
      transition: '1s',
      '&.inactive': {
        opacity: 0,
      },
      '&.active': {
        opacity: 1,
      }
    },
    title: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: '20px',
      width: '100%',
      maxWidth: '100%',

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
    tierLinkToAccount: {
      color: '#6399FF',
      textDecoration: 'underline'
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
        zIndex: 1,
        transition: '1s',
        transitionDelay: '0.5s',
        transitionTimingFunction: 'easy-in',

        '&.inactive': {
          width: '0!important'
        }
      }
    },
    tierInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,
      width: '1px',
      whiteSpace: 'nowrap',

      '& div': {
        marginBottom: '15px',
        width: '28px',
        height: '28px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C223B',
        borderRadius: '50%',
      },

      '&.active > div': {
        backgroundColor: '#232394',
      },

      '&:last-child': {
        alignItems: 'flex-end'
      },

      '&:nth-child(2)': {
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
    },
    [theme.breakpoints.down('xs')]: {
      tierInfo: {
        '& span:last-child': {
          height: '36px',
          textAlign: 'center'
        },
        '&:nth-child(2) span:last-child': {
          width: '100%',
          display: 'block',
        },
        '&:last-child span:last-child': {
          textAlign: 'right'
        }
      }
    }
  };
});

export default useStyles;
