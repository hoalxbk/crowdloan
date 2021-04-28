import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  uploadImageWrapper: {

  },
  imageItem: {
    padding: 15,
    paddingLeft: 0,
  },
  imageItemBtnWrapper: {
    width: 200,
  },

  btnUpdateItem: {
    margin: '25px 10px',
    color: '#3f51b5',
    fontSize: 25,
  },
  btnUpdateRemove: {
    margin: '25px 10px',
    color: 'red',
    fontSize: 25,
  }

}));

export default useStyles
