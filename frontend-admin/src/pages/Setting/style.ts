import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    settingPage: {
      '&__box': {
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
      },
      '&__form-wrapper': {
        display: 'flex',
        alignItems: 'flex-end',
      },
      '&__form-item': {
        flexGrow: 1,
      },
      '&__item-label': {
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '22px',
        fontFamily: 'Roboto-Bold',
        marginBottom: '3px',
      },
      '&__item-label-text': {
        marginRight: '10px',
      },
      '&__item-edit': {
        cursor: 'pointer',
        color: 'blue',
        textDecoration: 'underline',
      },
      '&__item-input': {
        backgroundColor: '#F0F0F0',
        height: '40px',
        borderRadius: 5,
        display: 'block',
        width: '100%',
        border: 'none',
        outline: 'none',
        padding: '10px 15px',
        color: 'rgba(0, 0, 0, 0.87)',
      },
      '&__form-button': {
        width: '100px',
        marginLeft: '10px',
        '& button': {
          height: '40px',
        }
      },

      '&__item-warning': {
        marginBottom: '8px',
      },

      '&__cta': {
        fontSize: 14,
        padding: '10px 20px',
        backgroundColor: '#F45155',
        color: 'white',
        border: 'none',
        borderRadius: 5,
        cursor: 'pointer',
        transition: '.2s all ease-in',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 600,

        '&.active': {
          backgroundColor: '#00AF12',
          '&:hover': {
            backgroundColor: '#21c832'
          }
        },

        '&.suspend': {
          '&:hover': {
            backgroundColor: '#E34549'
          }
        },

        '&:focus': {
          outline: 'none'
        },

      },

      '&__cta-icon': {
        marginLeft: 5
      }
    }
  };
});

export default useStyles;
