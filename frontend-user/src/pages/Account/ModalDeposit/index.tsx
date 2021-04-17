import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { approve } from '../../../store/actions/sota-token';
import { deposit } from '../../../store/actions/sota-tiers';
import useAuth from '../../../hooks/useAuth';
import { convertFromWei, convertToWei, convertToBN } from '../../../services/web3';

const closeIcon = '/images/icons/close.svg';
const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,}$/;

const ModalDeposit = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [depositAmount, setDepositAmount] = useState('0');
  const [disableApprove, setDisableApprove] = useState(true);
  const [disableDeposit, setDisableDeposit] = useState(true);

  const { data: allowance = 0 } = useSelector((state: any) => state.allowance);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = 0 } = useSelector((state: any) => state.balance);
  const { connectedAccount } = useAuth();


  const {
    setOpenModalDeposit,
    setOpenModalTransactionSubmitting,
    token
  } = props;

  useEffect(() => {
    if(!connectedAccount) return
    setDisableApprove(false)
    if(!isNaN(parseFloat(balance.token))
      && !isNaN(parseFloat(depositAmount)))
    {
      const tokenBalance = convertToBN(convertToWei(balance.token))
      const amount = convertToBN(convertToWei(depositAmount))
      const zero = convertToBN('0')
      setDisableDeposit(tokenBalance.lt(amount) || amount.lte(zero))
    }
  }, [connectedAccount, balance, depositAmount]);

  const onDeposit = () => {
    if(disableDeposit) return
    dispatch(deposit(connectedAccount, depositAmount));
    setOpenModalTransactionSubmitting(true);
    setOpenModalDeposit(false);
  }

  const onApprove = () => {
    dispatch(approve(connectedAccount, '1000000000'));
    setOpenModalTransactionSubmitting(true);
    setOpenModalDeposit(false);
  }

  const handleClose = () => {
    setOpenModalDeposit(false);
  }

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalDeposit}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={handleClose}/>
            <h2 className="title">You have {userInfo.staked} {token?.symbol} lock-in</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>Input</span>
              <span>Your wallet balance: { _.isEmpty(balance) ? 0 : parseFloat(balance.token).toFixed(2) } {token.symbol}</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={depositAmount}
                onChange={e => (e.target.value === '' || REGEX_NUMBER.test(e.target.value)) && setDepositAmount(e.target.value)}
              />
              <div>
                <button className="btn-max" onClick={() => setDepositAmount(balance.token)}>MAX</button>
              </div>
            </div>
          </div>
          <div className="modal-content__foot">
            {allowance <= 0 && <button
              className={"btn-approve " + (disableApprove ? 'disabled' : '')}
              onClick={onApprove}
            >approve</button>}
            {allowance > 0 && <button
              className={"btn-staking " + (disableDeposit ? 'disabled' : '')}
              onClick={onDeposit}
            >Lock-in</button>}
            <button
              className="btn-cancel"
              onClick={() => setOpenModalDeposit(false)}
            >cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDeposit;
