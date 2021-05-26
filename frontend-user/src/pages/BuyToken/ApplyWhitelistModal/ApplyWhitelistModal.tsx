import React, {useState} from 'react';
import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {ClipLoader} from "react-spinners";
import {useTypedSelector} from '../../../hooks/useTypedSelector';

import useStyles from './style';

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
  customClass: string,
  networkAvailable?: string,
}

export interface ComponentProps {
  opened: boolean,
  handleClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, customClass, onClose, ...other } = props;

  const customStyles = {
    color: 'white',
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
    padding: theme.spacing(1),
    color: '#999999'
  },
}))(MuiDialogContent);

const ApplyWhitelistModal: React.FC<any> = (props: any) => {
  const styles = useStyles();
  // const { appChainID } = useTypedSelector(state => state.appNetwork).data;
  // const { opened, handleClose, transactionHash, additionalText, networkAvailable } = props;
  const [openSubmitModal, setOpenSubmitModal] = useState(true);
  const handleClose = () => {
    setOpenSubmitModal(false);
  };
  const whitelistLink = 'https://bom.to/SH5Zcdln5TTSH';
  const instructionLink = 'https://bom.to/SH5Zcdln5TTSH';

  return (
      <Dialog open={openSubmitModal} onClose={handleClose} className={styles.dialog}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} customClass={styles.dialogTitle} >
          Whitelist Application Form
        </DialogTitle>
        <DialogContent>
          <div>

            <p style={{
              marginBottom: 10,
            }}>
              Please fill out the
              {' '}
              <a
                style={{
                  color: 'red',
                  fontWeight: 'bold'
                }}
                href={whitelistLink}
              >whitelist form</a>
              {' '}
              to participate in NFTify's IDO.
            </p>
            <p>
              You can read more about the instruction {' '}
              <a
                href={instructionLink}
                style={{
                  color: 'red',
                  fontWeight: 'bold'
                }}
              >here</a>
              .
            </p>

          </div>
        </DialogContent>
      </Dialog>
  )
}

export default ApplyWhitelistModal;