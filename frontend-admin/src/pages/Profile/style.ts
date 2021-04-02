import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  form: {
    maxWidth: 1000,
    padding: '30px',
    margin: '0 auto'
  },
  formContent: {
    display: 'flex',
    alignItems: 'center',
  },
  formControl: {
    marginTop: 30,
    width: '100%'
  },
  formControlLabel: {
    marginBottom: 10,
    display: 'inline-block',
    position: 'initial',
    fontSize: '13px',
    color: 'rgba(0, 0, 0, .54)'
  },
  formControlField: {
  },
  formField: {
    width: '100%',
    '&:not(:first-child)': {
      marginTop: 30
    }
  },
  formLeft: {
    width: 'calc(50% - 16px)',
    marginRight: 16
  },
  formRight: {
    width: 'calc(50% - 16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  formAvatarContainer: {
    textAlign: 'center'
  },
  formAvatar: {
    width: 180,
    height: 180,
    borderRadius: '50%',
    objectFit: 'cover',

  },
  formDesc: {
    marginTop: 15
  },
  formCta: {
    marginTop: 30,
    display: 'flex',
    padding: '12px 30px',
    backgroundColor: '#FFCC00',
    color: 'white',
    fontWeight: 700,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    transition: '.2s all ease-in',
    alignItems: 'center',
    fontSize: 14,

    '&:focus': {
      outline: 'none',
    }
  },
  formCtaRounded: {
    borderRadius: 20
  },

  formErrorMessage: {
    marginTop: 7,
    color: 'red',
  },
  formRedirect: {
    color: '#FFCC00',
    fontWeight: 600,
    display: 'inline-block',
    marginTop: 20,
    fontSize: 15
  }
}))

export default useStyles;
