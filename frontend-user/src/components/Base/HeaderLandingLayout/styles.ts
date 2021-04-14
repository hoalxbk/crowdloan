import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    navBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 120px',
      background: '#000',
      width: '100%',
      color: '#FFFFFF',
      font: 'normal normal bold 16px/24px DM Sans',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        position: 'static',
      },

      '& > div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        '& a': {
          color: '#FFFFFF'
        },

        '&.connects i': {
          marginLeft: '20px',

          '&::before': {
            color: '#9F9F9F'
          },

          '&:hover::before': {
            color: '#D01F37'
          }
        }
      }
    }
  };
});

export default useStyles;
