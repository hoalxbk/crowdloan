import { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { LinearProgress } from '@material-ui/core';
import { approve } from '../../../store/actions/sota-token';
import { deposit } from '../../../store/actions/sota-tiers';

const ModalDeposit = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [depositAmount, setDepositAmount] = useState('0');

  const { loading: depositing = false } = useSelector((state: any) => state.deposit);
  const { loading: approving = false } = useSelector((state: any) => state.approve);
  const { data: loginInvestor } = useSelector((state: any) => state.investor);
  const { data: allowance = 0 } = useSelector((state: any) => state.allowance);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = 0 } = useSelector((state: any) => state.balance);

  const {
    setOpenModalDeposit
  } = props;

  const onDeposit = () => {
    dispatch(deposit(loginInvestor.wallet_address, depositAmount));
  }

  const onApprove = () => {
    dispatch(approve(loginInvestor.wallet_address, '1000000000'));
  }

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalDeposit}>
        <div className="modal-content">
          <div className="modal-content__head">
            <h2 className="title">you have no Sota</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>Input</span>
              <span>Your wallet balance: { _.isEmpty(balance) ? 0 : parseFloat(userInfo.staked).toFixed() } SOTA</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
              />
              <div>
                <button className="btn-max" onClick={() => setDepositAmount(balance.sota)}>MAX</button>
              </div>
            </div>
          </div>
          <div className="modal-content__foot">
            {allowance == 0 && <button
              className="btn-approve"
              onClick={onApprove}
            >approve</button>}
            {allowance > 0 && <button
              className="btn-staking"
              onClick={onDeposit}
            >Lock-in</button>}
            <button
              className="btn-cancel"
              onClick={() => setOpenModalDeposit(false)}
            >cancel</button>
          </div>
        </div>
      </div>

      {
        approving && <div className={commonStyles.loadingTransaction}>
          <div className="content">
            Transaction loading
            <LinearProgress color="secondary" />
          </div>
        </div>
      }

      {
        depositing && <div className={commonStyles.loadingTransaction}>
          <div className="content">
            Transaction loading
            <LinearProgress color="secondary" />
          </div>
        </div>
      }
    </>
  );
};

export default ModalDeposit;