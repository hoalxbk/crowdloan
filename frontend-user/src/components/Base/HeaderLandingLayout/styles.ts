import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    navBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 120px',
      background: '#000',
      width: '100%',
      color: '#FFFFFF',
      font: 'normal normal bold 16px/24px DM Sans',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,

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
      },
      [theme.breakpoints.down('sm')]: {
        position: 'static',
        padding: '10px 40px',
      },
      [theme.breakpoints.down('xs')]: {
        padding: '10px 32px',
        flexDirection: 'row-reverse',
        position: 'relative',

        '& .logo img': {
          width: '30px',
        },

        '& .connects': {
          position: 'absolute',
          top: 'calc(100% + 31px)',
          right: '20px',
          flexDirection: 'column'
        }
      },
    }
  };
});

export default useStyles;
