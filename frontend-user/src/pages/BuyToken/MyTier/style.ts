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
    },
    table: {
      '& .MuiTableBody-root td': {
        font: 'normal normal normal 14px/24px Helvetica'
      }
    },
    tableContainer: {
      maxWidth: 700,
      width: 700,
      background: 'transparent',
      color: '#999999',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: 20,

      [theme.breakpoints.down('xs')]: {
        width: '100%'
      },

      '& th, & td': {
        color: '#999999'
      },

      '& .MuiTableCell-root': {
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }
    },
    tableHeaderWrapper: {
      backgroundColor: '#040D34',
      '& th': {
        font: 'normal normal bold 14px/18px DM Sans'
      }
    },
    tableHeader: {
      color: 'white !important' as any,
      fontWeight: 700,
      fontSize: 15,
      '& > span': {
        display: 'inline-block',
        width: '200px',
      },
      [theme.breakpoints.down('xs')]: {
        '& > span': {
          width: '120px',
          display: 'inline-block'
        }
      },
      [theme.breakpoints.down('md')]: {
        '& > span': {
          width: '120px',
        }
      },
    },
  };
});

export default useStyles;
