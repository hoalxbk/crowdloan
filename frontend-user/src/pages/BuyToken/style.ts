import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    poolDetailContainer: {
      padding: '40px 120px 80px 120px',
      [theme.breakpoints.down('xs')]: {
        padding: '40px 20px 80px 20px',
      }
    },
    poolDetailHeader: {
      paddingBottom: 20,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    poolHeaderWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    poolTicketWinner: {
      color: 'white',
      borderRadius: 4,
      padding: '13px 8px',
      backgroundColor: 'rgba(50, 50, 220, 0.2)',
      fontWeight: 600,
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      marginTop: 10
    },
    poolHeaderImage: {

    },
    poolImage: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      objectFit: 'cover'
    },
    poolHeaderInfo: {
      color: 'white',
      marginLeft: 12,
    },
    poolHeaderTitle: {
      fontWeight: 700,
      fontSize: 28,
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',

        '& > div': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        },
      }
    },
    poolHeaderType: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 30,
      fontSize: 17,
    },
    poolStatus: {
      fontSize: 14,
      marginLeft: 10,
      padding: '6px 30px',
      backgroundColor: 'blue',
      borderRadius: 40,

      '&--In-progress': {
        backgroundColor: '#ebc321'
      },
      '&--Joining': {
        background: "#6398FF"
      },
      '&--Upcoming': {
        background: "#6398FF"
      },
      '&--Closed': {
        backgroundColor: "#D01F36"
      },
      '&--Filled': {
        backgroundColor: "#12A064"
      }
    },
    poolHeaderAddress: {
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      marginTop: 8
    },
    poolHeaderCopy: {
      marginLeft: 10,
      display: 'inline-block',
      cursor: 'pointer'
    },
    poolDetailInfo: {
      background: 'transparent',
    },
    poolDetailIntro: {
      color: 'white',
      minWidth: 400,
      width: '30%',
      marginRight: 120,
      [theme.breakpoints.down('xs')]: {
        marginRight: 0,
        minWidth: 'unset',
        width: '100%',
        marginBottom: '30px'
      }
    },
    poolDetailBasic: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',

      '&:not(:first-child)': {
        marginTop: 30
      }
    },
    poolDetailBasicLabel: {
      color: '#999999',
      fontSize: 15,
      fontWeight: 400
    },
    poolsDetailBasicText: {
      fontWeight: 600,
      color: 'white',
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      marginLeft: 50
    },
    poolDetailUtil: {
      marginLeft: 10,
      display: 'inline-block',
      cursor: 'pointer',
    },
    poolDetailTierWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 30,
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      }
    },
    poolDetailTier: {
      padding: '28px 40px',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8,
      width: '60%',
    },
    poolDetailMaxBuy: {
      marginTop: 15,
      color: '#999999'
    },
    poolDetailProgress: {
      color: 'white',
      marginTop: 32
    },
    poolDetailProgressTitle: {
      fontWeight: 700,
      fontSize: 15
    },
    poolDetailProgressStat: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '12px 0px 5px 0px',
      color: '#999999'
    },
    poolDetailProgressPercent: {
      fontWeight: 600,
      fontSize: 17,
      color: 'white'
    },
    progress: {
      width: '100%',
      height: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      position: 'relative'
    },
    achieved: {
      width: '30%',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: '#232394',
      borderRadius: '0px 20px 20px 0px'
    },
    poolDetailStartTime: {
      marginTop: 28
    },
    poolDetailStartTimeTitle: {
      color: '#999999',
      fontWeight: 700,
      fontSize: 14
    },
    btnGroup: {
      marginTop: 40,

      '& button:first-child': {
        marginRight: 10
      }
    },
    poolDetailBuy: {
      color: 'white'
    },
    poolDetailBuyNav: {
      marginTop: 100
    },
    poolDetailLink: {
      marginRight: 120,
      fontWeight: 'bold',
      fontSize: 15,
      color: '#999999',
      cursor: 'pointer',
      paddingBottom: 12,
      position: 'relative'
    },
    poolDetailLinkActive: {
      '&::before': {
        content: '""',
        position: 'absolute',
        height: 3,
        left: 0,
        backgroundColor: '#6398FF',
        bottom: 0,
        width: '100%',
        borderRadius: 20
      }
    },
    poolDetailLinks: {
      display: 'flex',
      borderBottom: '1px solid rgba(255, 255, 255, .1)'
    },
    poolDetailBuyForm: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    loader: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loaderText: {
      fontWeight: 700,
      marginTop: 20,
      color: "#999999",
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      poolDetailTier: {
        padding: '20px',
        width: '100%',
      },
      poolHeaderAddress: {
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        marginTop: 8
      },
      poolDetailProgressPercent: {

      }
    },
    [theme.breakpoints.down('xs')]: {
      poolDetailLink: {
        marginRight: '20px',
      },
      poolDetailTier: {
        width: '100%',
        padding: '10px'
      },
      btnGroup: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
          padding: '15px 25px',
          width: '140px'
        }
      },
      poolHeaderType: {
        marginLeft: '0'
      },
      poolHeaderWrapper: {
        alignItems: 'flex-start'
      },
      poolStatus: {
        paddingRight: '10px',
        paddingLeft: '10px',
        marginLeft: '5px'
      },
      poolsDetailBasicText: {
        justifyContent: 'flex-end',
        marginLeft: 0,
        textAlign: 'right'
      },
    }
  };
});

export default useStyles;
