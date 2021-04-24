import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    modalVerifyEmail: {
      '& .modal-content__body': {
        padding: 0,
      },
      '& .modal-content__body .input-group': {
        background: '#11152A',
        padding: '0 10px',
        marginTop: '10px'
      },
      '& .disabled': {
        backgroundColor: 'silver'
      }
    }
  };
});

export default useStyles;
