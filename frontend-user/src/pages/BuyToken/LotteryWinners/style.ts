import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    LotteryWinners: {
    },
    LotteryWinnersDesc: {
      marginTop: 30,
      marginBottom: 16
    },
    table: {
    },
    tableContainer: {
      maxWidth: 700,
      width: 700,
      background: 'transparent',
      color: '#999999',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: 20,

      '& th, & td': {
        color: '#999999'
      },

      '& .MuiTableCell-root': {
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }
    },
    tableHeaderWrapper: {
      backgroundColor: '#040D34'
    },
    tableHeader: {
      color: 'white !important' as any,
      fontWeight: 700,
      fontSize: 15
    },
    tableSearchWrapper: {
      maxWidth: 360,
      position: 'relative',
      background: '#11152A',
      border: '1px solid #2D2F36',
      borderRadius: 4
    },
    tableSearchIcon: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)'
    },
    tableSearch: {
      background: 'transparent',
      padding: '14px 0px 14px 12px',
      border: 'none',
      color: 'white',
      width: '80%',

      '&:focus': {
        outline: 'none'
      },

      '&::placeholder': {
        color: '#999999',
        fontWeight:  400,
        fontSize: 15
      }
    },
    pagination: {
      '& *': {
        color: 'white'
      }
    }
  };
});

export default useStyles;
