import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    login: {
      minHeight: '100vh',
      '& .login__wrap': {
        width: '500px',
        maxWidth: '100%',
        textAlign: 'left',
        margin: '0 auto'
      },
      '& .login__logo': {
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
      },
      '& .login-logo': {
        width: 20
      },
      '& .login__logo-ether': {
        display: 'flex',
        alignItems: 'flex-start',
        margin: '50px 0px'
      },
      '& .login__logo img': {
        height: '40px',
      },

      '& .login__title': {
        fontWeight: 900,
        color: theme.custom.colors.primary,
        fontSize: '20px',
        marginLeft: 10
      },
      '& .login__description': {
        fontSize: '16px',
        marginBottom: '30px',
      },
      '& .login__button': {
        marginBottom: '30px',
      },
      '& .login__button--bold': {
        textTransform: 'uppercase',
        fontWeight: 700
      },
      '& .login__logo-metamask img': {
        width: '40px',
      },

      '& .login__logo-ether-desc': {
        marginLeft: '30px',
        textAlign: 'left'
      },

      '& .login__logo-ether img': {
        width: '40px'
      },
      
      '& .login__logo-ether-title': {
        fontSize: 35
      },

      '& .logo__desc--bold': {
        fontWeight: 700,
        marginBottom: 5
      },

      '& .MuiFormControl-root': {
        width: '100%'
      },

      '& .login__form': {
        marginTop: 20,
      },

      '& .login__form-field': {
        marginTop: 20
      },

      '& .login__form-desc': {
        marginTop: 30
      },

      '& .login__form-error-message': {
        marginTop: 7,
        color: 'red',
      },

      '& .login__form-privacy a': {
        color: '#337ab7'
      },

      '& .login__form-forgot-password': {
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: 15,
        display: 'inline-block',
        color: 'blue'
      },

      '& .login__form-button': {
        marginTop: 30,
        padding: '13px 25px',
        fontWeight: 600,
        borderRadius: 5,
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#FFCC00',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        transition: '.2s all ease-in',

        '&:hover': {
          backgroundColor: '#ffd118' 
        },

        '&:focus': {
          outline: 'none'
        }
      },

      '& .login__user-loading': {
        textAlign: 'center'
      },

      '& .login__user-loading-text': {
        fontWeight: 700,
        fontSize: 20,
        marginTop: 25
      },


      [theme.breakpoints.up('md')]: {
        '& .login__title': {
          lineHeight: '70px',
        },
        '& .login__logo': {
          marginBottom: '30px',
          '& img': {

          }
        },
        '& .login__logo img': {
        },
        '& .login__description': {
          marginBottom: '60px',
        },
        '& .login__button button': {
          height: '60px',
        },
        '& .login__logo-metamask img': {
          width: 'auto',
        },
      },
    }
  };
});

export default useStyles
