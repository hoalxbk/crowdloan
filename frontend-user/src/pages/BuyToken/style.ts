import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    poolDetailContainer: {

    },
    poolDetailHeader: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 20,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    poolHeaderImage: {

    },
    poolHeaderInfo: {
      color: 'white',
      marginLeft: 12,
    },
    poolHeaderTitle: {
      fontWeight: 700,
      fontSize: 28
    },
    poolHeaderAddress: {
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      marginTop: 5
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
      minWidth: 340,
      marginRight: 120
    },
    poolDetailBasic: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',

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
      alignItems: 'center'
    },
    poolDetailUtil: {
      marginLeft: 10,
      display: 'inline-block',
      cursor: 'pointer',
    },
    poolDetailTierWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30
    },
    poolDetailTier: {
      padding: '28px 40px',
      background: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 8
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
      '& .css-1isorwc': {
        top: '50%',
        transform: 'translateY(-50%)'
      }
    },
    loaderText: {
      fontWeight: 700,
      marginTop: 20
    }
  };
});

export default useStyles;
