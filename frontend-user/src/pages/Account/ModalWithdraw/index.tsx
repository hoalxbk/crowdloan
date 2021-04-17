import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { gt } from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { withdraw, getWithdrawFee } from '../../../store/actions/sota-tiers';
import useAuth from '../../../hooks/useAuth';
import { convertFromWei, convertToWei, convertToBN } from '../../../services/web3';

const closeIcon = '/images/icons/close.svg';
const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,}$/;

const ModalWithdraw = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const [disableWithdraw, setDisableWithdraw] = useState(true);

  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: withdrawFee = {} } = useSelector((state: any) => state.withdrawFee);
  const { connectedAccount } = useAuth();

  const {
    setOpenModalWithdraw,
    setOpenModalTransactionSubmitting,
    token
  } = props;

  const onWithDraw = () => {
    dispatch(withdraw(connectedAccount, withdrawAmount));
    setOpenModalTransactionSubmitting(true);
    setOpenModalWithdraw(false);
  }

  const handleClose = () => {
    setOpenModalWithdraw(false);
  }

  useEffect(() => {
    if(!connectedAccount) return
    if(!isNaN(parseFloat(userInfo.staked))
      && !isNaN(parseFloat(withdrawAmount)))
    {
      const staked = convertToBN(convertToWei(userInfo.staked))
      const amount = convertToBN(convertToWei(withdrawAmount))
      const zero = convertToBN('0')
      setDisableWithdraw(staked.lt(amount) || amount.lte(zero));
    }
  }, [connectedAccount, userInfo, withdrawAmount]);

  useEffect(() => {
    dispatch(getWithdrawFee(connectedAccount, withdrawAmount))
  }, [withdrawAmount])

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalWithdraw}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={handleClose}/>
            <h2 className="title">You have {userInfo.staked} {token?.symbol} lock-in</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>Input</span>
              <span>Your wallet staked: { _.isEmpty(userInfo) ? 0 : parseFloat(userInfo.staked).toFixed() } {token?.symbol}</span>
            </div>
            <div className="subtitle">
                <span>Penalty</span>
                <span>{ withdrawFee.fee?.toString() || 0 } {token?.symbol}</span>
              </div>
            <div className="input-group">
              <input
                type="text"
                value={withdrawAmount}
                onChange={e => (e.target.value === '' || REGEX_NUMBER.test(e.target.value)) && setWithdrawAmount(e.target.value)}
                placeholder="0.00"
              />
              <div>
                <button className="btn-max" onClick={() => setWithdrawAmount(userInfo.staked)}>MAX</button>
              </div>
            </div>
          </div>
          <div className="modal-content__foot">
            {userInfo.staked > 0 && <button
              className={"btn-staking " + (disableWithdraw ? 'disabled' : '')}
              onClick={onWithDraw}
            >Unlock</button>}
            <button
              className="btn-cancel"
              onClick={() => setOpenModalWithdraw(false)}
            >cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWithdraw;
