import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    contentManageTier: {
      width: '52%',
      maxWidth: '100%',

      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },

      '& .button-area': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 56,
      },

      '& .button-area .btn': {
        color: theme?.custom?.colors?.white,
        height: '42px',
        borderRadius: '40px',
        fontFamily: 'DM Sans',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: '24px',
        border: 'none',
        outline: 'none',
        padding: '0 35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 160,

        '&:hover': {
          cursor: 'pointer',
        },

        '&.disabled': {
          backgroundColor: 'silver',
        },
      },

      '& .button-area .btn-lock': {
        background: '#3232DC',
        marginRight: 8,
      },

      '& .button-area .btn-unlock': {
        background: theme?.custom?.colors?.cardinal,
      },
    },

    noteNetwork: {
      color: theme?.custom?.colors?.cardinal,
      font: 'normal normal bold 14px/18px DM Sans',
      marginTop: '15px',
    },

    manageTier: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },

    walletBalance: {
      background: theme?.custom?.colors?.sharkLight,
      border: `1px solid ${theme?.custom?.colors?.abbey}`,
      borderRadius: 8,
    },

    tableHead: {
      background: theme?.custom?.colors?.shark,
      color: theme?.custom?.colors?.white,
      borderRadius: '8px 8px 0px 0px',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',

      '& .group': {
        display: 'flex',
        justifyContent: 'space-between',
        minHeight: 56,
        alignItems: 'center',
        paddingLeft: 27,
        paddingRight: 27,
      }
    },

    tableBody:  {
      color: theme?.custom?.colors?.white,
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',

      '& .group': {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: 56,
        alignItems: 'center',
        paddingLeft: 27,
        paddingRight: 27,
      },

      '& .group span': {
        width: '33%',
        wordBreak: 'break-all',

        '&:first-child': {
        },

        '&:last-child': {
          textAlign: 'right',
        },

        '&:nth-child(2)': {
          textAlign: 'center',
        }
      }
    },

    balance: {
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: '28px',
      lineHeight: '32px',
      color: theme?.custom?.colors?.white,
      marginTop: '8px',
      marginBottom: '13px',
    },
  };
});

export default useStyles;
