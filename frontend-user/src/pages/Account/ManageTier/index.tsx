import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { set } from 'lodash';
import useStyles from './style';
import { withMobileDialog } from '@material-ui/core';
const byTokenLogo = '/images/logo-in-buy-page.png';

const ManageTier = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch()

  const [openModalDeposit, setOpenModalDeposit] = useState(false)
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false)
  const [depositAmount, setDepositAmount] = useState('0')
  const [withdrawAmount, setWithdrawAmount] = useState('0')

  const { loading: loadingDeposit = {} } = useSelector((state: any) => state.deposit);
  const { loading: loadingWithdraw = {} } = useSelector((state: any) => state.withdraw);
  const { data: penalty = {} } = useSelector((state: any) => state.withdraw);

  const { 
    classNamePrefix = '',
    balance = {},
    allowance = {},
    onApprove,
    deposit,
    withdraw,
    userInfo
  } = props;
  const { data: loginInvestor } = useSelector((state: any) => state.investor);

  const handleKYC = () => {
    console.log('hande KYC')
  }

  const onDeposit = () => {
    dispatch(deposit(loginInvestor.wallet_address, depositAmount));
  }

  const onWithDraw = () => {
    dispatch(withdraw(loginInvestor.wallet_address, withdrawAmount));
  }


  useEffect(() => {
    console.log(loadingDeposit, 'loadingDeposit')

    if(loadingDeposit == false) setOpenModalDeposit(false)
  }, [loadingDeposit])

  useEffect(() => {
    console.log(loadingWithdraw, 'loadingWithdraw')
    if(loadingWithdraw == false) setOpenModalWithdraw(false)
  }, [loadingWithdraw])

  return (
    <div className={`${classNamePrefix}__component`}>
      <div className={styles.content}>
        <p className={styles.textDefault}>Available balance</p>
        <p className={styles.balance}>{ balance.sota }</p>
        <div className="button-area">
          <button className="btn btn-lock" onClick={() => {setOpenModalDeposit(true)}}>
            Lock - in
          </button>
          <button className="btn btn-unlock" onClick={() => {setOpenModalWithdraw(true)}}>
            Unlock
          </button>
        </div>
        
        <div className={styles.PenaltyInfomation}>
          <p className="title">Disclaimer</p>
          <p className="subcription">There are penalties when you unlock, based on the date you deposited your last tokens:</p>
          <ul>
            <li>
              <span className={styles.textDefault}>less than 10 days ago</span>
              <span>30%</span>
            </li>
            <li>
              <span className={styles.textDefault}>less than 20 days ago</span>
              <span>25%</span>
            </li>
            <li>
            <span className={styles.textDefault}>less than 30 days ago</span>
              <span>20%</span>
            </li>
            <li>
            <span className={styles.textDefault}>less than 60 days ago</span>
              <span>10%</span>
            </li>
            <li>
            <span className={styles.textDefault}>less than 90 days ago</span>
              <span>5%</span>
            </li>
            <li>
            <span className={styles.textDefault}>after 90 days</span>
              <span>0%</span>
            </li>
          </ul>

          <p className="subtitle">Disclaimer</p>
          <div className="current-penalty"><span className={styles.textDefault}>Current penalty</span><span>0%</span></div>
          <div className="last-deposit">
            <span className={styles.textDefault}>Last Deposit</span>
            <span>0 day(s) ago</span>
          </div>
        </div>
      </div>

      {openModalDeposit && <div className={styles.modal}>
        <div className="modal-content">
          <div className="modal-content__head">
            <h2 className="title">you have no Sota</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>INPUT</span>
              <span>Your balance: { _.isEmpty(balance) ? 0 : balance.sota }</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
              />
              <div>
                <button className="btn-max" onClick={() => setDepositAmount(balance.sota)}>MAX</button>
                <span>SOTA</span>
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
            >stake</button>}
            <button
              className="btn-cancel"
              onClick={() => setOpenModalDeposit(false)}
            >cancel</button>
          </div>
        </div>
      </div>}

      {openModalWithdraw && <div className={styles.modal}>
        <div className="modal-content">
          <div className="modal-content__head">
            <h2 className="title">you have no Sota</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>INPUT</span>
              <span>Your balance: { _.isEmpty(balance) ? 0 : userInfo.staked }</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
              />
              <div>
                <button className="btn-max" onClick={() => setWithdrawAmount(userInfo.staked)}>MAX</button>
                <span>SOTA</span>
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
              onClick={onWithDraw}
            >stake</button>}
            <button
              className="btn-cancel"
              onClick={() => setOpenModalWithdraw(false)}
            >cancel</button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default ManageTier;
