import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    card: {
      borderRadius: '20px',
//       background: 'linear-gradient(360deg, rgba(373949) 0%, #252732 23.38%)',
// opacity: 0.4;
      overflow: 'hidden'
    },
    cardHeader: {
      position: 'relative',

      '& > img': {
        width: '100%',
        maxHeight: '160px',
        objectFit: 'cover',
      },

      '& .time': {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: '#030925',
        borderRadius: '40px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '14px',
        color: '#FFFFFF',
        padding: '6px 15px',

        '&.filled': {
          backgroundColor: '#12A064'
        },

        '&.closed': {
          backgroundColor: '#D01F36'
        }
      }
    },
    cardBody: {
      padding: '16px 24px',
      '& .card-content__title': {
        display: 'flex',
        flexDirection: 'row',

        '& .img': {
          minWidth: '36px'
        },

        '& > div': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%'
        },

        '& > div h2': {
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '18px',
          lineHeight: '24px',
          color: '#FFFFFF',
          textAlign: 'left',
          marginBottom: '0'
        },

        '& > div p': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#999999',
        }
      },

      '& .card-content__content': {
        display: 'flex',
        flexDirection: 'column',

        '& li': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: '10px',

          '& span:first-child': {
            fontFamily: 'Helvetica',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '18px',
            color: '#999999',
          },

          '& span:last-child': {
            fontFamily: 'DM Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '18px',
            color: '#FFFFFF',
          },

          '& .total': {
            fontFamily: 'DM Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '18px',
            lineHeight: '24px',
            color: '#6398FF',
          },
        },
      },

      '& .token-area': {
        marginTop: '30px',
        display: 'flex',
      },
      '& .token-area > div': {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '5px 17px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '12px'
      },
      '& .token-area img': {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        marginRight: '10px'
      },
      '& .token-area span': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '18px',
        color: '#999999',
      },

      '& .progress-area': {
        marginTop: '30px',

        '& p': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#999999',
        },

        '& .progress': {
          display: 'block',
          width: '100%',
          height: '6px',
          background: '#C4C4C4',
          borderRadius: '20px',
          margin: '12px 0 8px 0',

          '& .current-progress': {
            height: '6px',
            background: '#12A064',
            borderRadius: '20px',
            display: 'block'
          }
        },

        '& div': {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        },

        '& div span': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#999999',
        },

        '& div div span:first-child': {
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '14px',
          lineHeight: '18px',
          color: '#FFFFFF',
        },
      }
    }
  };
});

export default useStyles;