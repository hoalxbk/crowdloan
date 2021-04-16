import _, { set } from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';

const closeIcon = '/images/icons/close.svg'

const ModalTransaction = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();

  const {
    transactionHashes,
    setTransactionHashes
  } = props;

  const handleClose = () => {
    let array = [...transactionHashes];
    array.shift();
    setTransactionHashes(array);
    console.log(array)
  }

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalTransaction}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={handleClose}/>
            <h2 className="title">Transaction Submitted</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>TXn Hash</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={transactionHashes[0]}
                disabled
              />
            </div>
          </div>
          <div className="modal-content__foot">
            <a
              href={`https://etherscan.io/tx/${transactionHashes[0]}`}
              target="_blank"
              className={commonStyles.nnb1418d}
            >View on Etherscan</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalTransaction;
