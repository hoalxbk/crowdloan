import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    wattingWrapper: {
      marginBottom: 25,
      fontSize: 15
    },
    wattingForCampaign: {
      fontWeight: 'bold',
      fontSize: 22,
      letterSpacing: 0.15,
    },
    wattingText: {
      paddingBottom: 7,
    },
    claimTokenNumber: {
      fontWeight: 700,
      fontSize: 30,
      padding: '7px 0px',
    },
    tokenSymbol: {
      fontSize: 16,
      fontWeight: 500,
      marginLeft: 10,
      verticalAlign: 'middle',
    },
    dontHaveCoin: {
      color: 'red',
      textAlign: 'center',
    },
  };
});

export default useStyles;
