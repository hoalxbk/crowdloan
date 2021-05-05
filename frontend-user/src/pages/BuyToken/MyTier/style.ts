import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    MyTier: {
      marginTop: 30,
      font: 'normal normal bold 14px/18px DM Sans'
    },
    MyTierWinningLottery: {
    },
    MyTierAccountRedirect: {
      color: '#999999',
      fontFamily: 'Helvetica',
      fontWeight: 'normal',
      lineHeight: '24px'
    },
    MyTierRulesHeader: {
      marginTop: 15,
      fontFamily: 'Helvetica',
      fontSize: 15,
      fontWeight: 'normal'
    }
  };
});

export default useStyles;
