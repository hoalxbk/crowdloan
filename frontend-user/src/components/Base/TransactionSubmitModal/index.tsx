import React from 'react';
import { withStyles, Theme, createStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { ClipLoader } from "react-spinners";

import useStyles from './style';

const ETHERSCAN_URL = process.env.REACT_APP_ETHERSCAN_BASE_URL || "";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      background: '#020616',
      paddingTop: 0
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: 'black',
      backgroundColor: '#4B4B4B',
      padding: 4,

      "&:hover" : {
        backgroundColor: '#D4D4D4'
      }
    },
    svgIcon: {
      fontSize: 5
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
  customClass: string
}

export interface ComponentProps {
  opened: boolean,
  handleClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, customClass, onClose, ...other } = props;

  const customStyles = {
    color: 'white',
    fontSize: 28,
    fontWeight: 700
  }

  return (
    <MuiDialogTitle disableTypography className={`${classes.root} ${customClass}`} {...other} style={customStyles}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    color: '#999999'
  },
}))(MuiDialogContent);

const TransactionSubmitModal: React.FC<any> = (props: any) => {
  const styles = useStyles();
  const { opened, handleClose, transactionHash } = props;

  return (
      <Dialog open={opened} onClose={handleClose} className={styles.dialog}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} customClass={styles.dialogTitle} >
          Transaction {transactionHash ? 'Submitted': 'Submitting'}
        </DialogTitle>
        <DialogContent>
          <div>
            {
              transactionHash ? (
                <>
                <span>TXn Hash</span>
                <input value={transactionHash} className={styles.dialogInput} disabled={true} />
                <a 
                  href={`${ETHERSCAN_URL}/tx/${transactionHash}`} 
                  className={styles.dialogButton} 
                  target="_blank"
                >
                  View on Etherscan
                </a>
                </>
              ): <ClipLoader color={'white'}/>
            }
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default TransactionSubmitModal;