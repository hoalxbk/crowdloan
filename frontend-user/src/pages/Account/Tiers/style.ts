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
        transitionTimingFunction: 'linear',

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

      '& .icon': {
        marginBottom: '15px',
        width: '28px',
        height: '28px',
        minWidth: '28px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C223B',
        borderRadius: '50%',
      },

      '& .info': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },

      '&.active > .icon': {
        backgroundColor: '#232394',
      },

      '&:last-child': {
        alignItems: 'flex-end'
      },

      '&:last-child .info': {
        alignItems: 'flex-end'
      },

      '&:nth-child(2)': {
        alignItems: 'flex-start'
      },

      '&:nth-child(2) .info': {
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
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        height: '1px',

        '& .info': {
          alignItems: 'flex-start',
          marginLeft: '20px'
        },

        '& .icon': {
          marginBottom: '0'
        },

        '& span:last-child': {
          height: '18px',
        },
        '&:nth-child(2) span:last-child': {
          width: '100%',
          display: 'block',
        },
        '&:last-child span:last-child': {
          textAlign: 'right'
        },

        '&:last-child .info': {
          alignItems: 'flex-start'
        },
      },
      tierList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        height: '310px',

        '&::before': {
          content: '""',
          display: 'block',
          width: '5px',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '11.5px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '& li.process': {
          height: '0',
          width: '5px',
          position: 'absolute',
          top: '0',
          left: '11.5px',
  
          '&.inactive': {
            width: '5!important',
            height: '0!important'
          }
        }
      }
    }
  };
});

export default useStyles;
