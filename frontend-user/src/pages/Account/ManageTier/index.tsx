import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import { getWithdrawPercent, getWithdrawFee } from '../../../store/actions/sota-tiers'
import ModalDeposit from '../ModalDeposit'
import ModalWithdraw from '../ModalWithdraw'

const ManageTier = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch()

  const [openModalDeposit, setOpenModalDeposit] = useState(false)
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false)
  const [loadedWithdrawPercent, setLoadedWithdrawPercent] = useState(false)
  const [penaltyPercent, setPenaltyPercent] = useState(0)

  const { loading: depositing = {} } = useSelector((state: any) => state.deposit);
  const { loading: withdrawing = {} } = useSelector((state: any) => state.withdraw);
  const { data: withdrawPercent = {} } = useSelector((state: any) => state.withdrawPercent)
  const { data: withdrawFee = {} } = useSelector((state: any) => state.withdrawFee)
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = {} } = useSelector((state: any) => state.balance);


  const { 
    classNamePrefix = '',
  } = props;

  const { data: loginInvestor } = useSelector((state: any) => state.investor);

  const handleKYC = () => {
    console.log('hande KYC')
  }

  useEffect(() => {
    if(!loadedWithdrawPercent) {
      /* dispatch(getWithdrawPercent()); */
      setLoadedWithdrawPercent(true)
    }
  })

  useEffect(() => {
    dispatch(getWithdrawFee(loginInvestor.wallet_address, userInfo.staked));
    setPenaltyPercent(Math.round(parseFloat(withdrawFee) * 100 / parseFloat(userInfo.staked)))
  }, [withdrawFee, userInfo, withdrawFee])

  useEffect(() => {
    if(depositing == false) setOpenModalDeposit(false)
  }, [depositing])

  useEffect(() => {
    if(withdrawing == false) setOpenModalWithdraw(false)
  }, [withdrawing])

  return (
    <div className={`${classNamePrefix}__component`}>
      <div className={styles.content}>
        <p className={styles.textDefault}>Available balance</p>
        <p className={styles.balance}>{ parseFloat(balance.sota || 0).toFixed(2) }</p>
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
              <span>{ `${withdrawPercent.penaltiesPercent && withdrawPercent.penaltiesPercent[0] || 0 }%` }</span>
            </li>
            <li>
              <span className={styles.textDefault}>less than 20 days ago</span>
              <span>{ `${withdrawPercent.penaltiesPercent && withdrawPercent.penaltiesPercent[1] || 0 }%` }</span>
            </li>
            <li>
            <span className={styles.textDefault}>less than 30 days ago</span>
              <span>{ `${withdrawPercent.penaltiesPercent && withdrawPercent.penaltiesPercent[2] || 0 }%` }</span>
            </li>
            <li>
            <span className={styles.textDefault}>less than 60 days ago</span>
              <span>{ `${withdrawPercent.penaltiesPercent && withdrawPercent.penaltiesPercent[3] || 0 }%` }</span>
            </li>
            <li>
            <span className={styles.textDefault}>less than 90 days ago</span>
              <span>{ `${withdrawPercent.penaltiesPercent && withdrawPercent.penaltiesPercent[4] || 0 }%` }</span>
            </li>
            <li>
            <span className={styles.textDefault}>after 90 days</span>
              <span>{ `${withdrawPercent.penaltiesPercent && withdrawPercent.penaltiesPercent[5] || 0 }%` }</span>
            </li>
          </ul>

          <p className="subtitle">Disclaimer</p>
          <div className="current-penalty">
            <span className={styles.textDefault}>Current penalty</span>
            <span>{ `${penaltyPercent}%` }</span>
          </div>
          <div className="last-deposit">
            <span className={styles.textDefault}>Last Deposit</span>
            <span>0 day(s) ago</span>
          </div>
        </div>
      </div>
      {openModalDeposit && <ModalDeposit setOpenModalDeposit={setOpenModalDeposit} />}
      {openModalWithdraw && <ModalWithdraw setOpenModalWithdraw={setOpenModalWithdraw} />}
    </div>
  );
};

export default ManageTier;
