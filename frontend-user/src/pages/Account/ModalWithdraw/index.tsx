import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { LinearProgress } from '@material-ui/core';
import { withdraw, getWithdrawFee } from '../../../store/actions/sota-tiers';

const ModalWithdraw = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [withdrawAmount, setWithdrawAmount] = useState('0');

  const { loading: withdrawing = false } = useSelector((state: any) => state.withdraw);
  const { data: loginInvestor } = useSelector((state: any) => state.investor);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: withdrawFee = 0 } = useSelector((state: any) => state.withdrawFee);

  const {
    setOpenModalWithdraw
  } = props;

  const onWithDraw = () => {
    dispatch(withdraw(loginInvestor.wallet_address, withdrawAmount));
  }

  useEffect(() => {
    dispatch(getWithdrawFee(loginInvestor.wallet_address, withdrawAmount))
  }, [withdrawAmount])

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalWithdraw}>
        <div className="modal-content">
          <div className="modal-content__head">
            <h2 className="title">you have no Sota</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>Input</span>
              <span>Your wallet staked: { _.isEmpty(userInfo) ? 0 : parseFloat(userInfo.staked).toFixed() } SOTA</span>
            </div>
            <div className="subtitle">
                <span>Penalty</span>
                <span>{ withdrawFee.toString() } SOTA</span>
              </div>
            <div className="input-group">
              <input
                type="text"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
              />
              <div>
                <button className="btn-max" onClick={() => setWithdrawAmount(userInfo.staked)}>MAX</button>
              </div>
            </div>
          </div>
          <div className="modal-content__foot">
            {userInfo.staked > 0 && <button
              className="btn-staking"
              onClick={onWithDraw}
            >Unlock</button>}
            <button
              className="btn-cancel"
              onClick={() => setOpenModalWithdraw(false)}
            >cancel</button>
          </div>
        </div>
      </div>

      {
        withdrawing && <div className={commonStyles.loadingTransaction}>
          <div className="content">
            Transaction loading
            <LinearProgress color="secondary" />
          </div>
        </div>
      }
    </>
  );
};

export default ModalWithdraw;
