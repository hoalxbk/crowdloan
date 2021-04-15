import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    container: {
      position: 'relative',
      '& img': {
        width: '100%',
        height: 'auto',
      },
      '& .main-content h1': {
        textAlign: 'center',
        fontSize: '68px',
        lineHeight: '80px',
        color: '#FFFFFF',
        marginBottom: '12px'
      },
      '& .main-content p': {
        textAlign: 'center',
        color: '#FFFFFF'
      },
      '& .buttons': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        '& img': {
          width: '20px',
          height: '10px'
        }
      },
      '& .buttons button': {
        height: '42px',
        color: '#FFFFFF',
        border: 'none',
        outline: 'none',
        padding: '0 35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '60px',
        margin: '60px 6px 0 6px',

        '&:first-child': {
          backgroundColor: '#D01F36'
        },

        '&:last-child': {
          backgroundColor: '#3232DC'
        }
      },
      '& > div': {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        width: '100%'
      },
      [theme.breakpoints.down('sm')]: {
        overflow: 'hidden',
        '& img': {
          objectFit: 'cover',
          height: '600px'
        },
        '& .main-content h1': {
          display: 'block',
          width: '400px',
          margin: '15px auto'
        },
      },
    },
    cardContainer: {
      margin: '80px 0',

      '& h2': {
        color: '#FFFFFF',
        marginBottom: '40px',
        textAlign: 'center'
      },
      '& .main-content': {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        margin: '0 120px',
        gap: '25px',
      },
      [theme.breakpoints.down('sm')]: {
        '& .main-content': {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          margin: '0 40px',
          gap: '25px',
        },
      },
      [theme.breakpoints.only('xs')]: {
        '& .main-content': {
          display: 'grid',
          gridTemplateColumns: '1fr',
          margin: '0 40px',
          gap: '25px',
        },
      },
    },
  };
});

export default useStyles;
