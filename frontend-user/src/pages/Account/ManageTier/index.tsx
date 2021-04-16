import {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { LinearProgress } from '@material-ui/core';
import { getWithdrawPercent, getWithdrawFee } from '../../../store/actions/sota-tiers';
import ModalDeposit from '../ModalDeposit';
import ModalWithdraw from '../ModalWithdraw';
import ModalTransaction from '../ModalTransaction';
import useTokenDetails from '../../../hooks/useTokenDetails';

const TOKEN_ADDRESS = process.env.REACT_APP_SOTA || '';
const iconClose = '/images/icons/close.svg'

const ManageTier = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const dispatch = useDispatch()

  const [openModalDeposit, setOpenModalDeposit] = useState(false)
  const [openModalTransactionSubmitting, setOpenModalTransactionSubmitting] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState([]) as any;
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false)
  const [penaltyPercent, setPenaltyPercent] = useState(0)


  const { data: depositTransaction } = useSelector((state: any) => state.deposit);
  const { data: approveTransaction } = useSelector((state: any) => state.approve);
  const { data: widthdrawTransaction } = useSelector((state: any) => state.approve);
  const { data: withdrawPercent = {} } = useSelector((state: any) => state.withdrawPercent)
  const { data: withdrawFee = {} } = useSelector((state: any) => state.withdrawFee)
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { tokenDetails, loading } = useTokenDetails(TOKEN_ADDRESS);

  const { 
    classNamePrefix = '',
  } = props;

  const { data: loginInvestor } = useSelector((state: any) => state.investor);

  const handleKYC = () => {
    console.log('hande KYC')
  }

  useEffect(() => {
    dispatch(getWithdrawPercent());
  }, [])

  useEffect(() => {
    if(depositTransaction.transactionHash) {
      setTransactionHashes([...transactionHashes, depositTransaction.transactionHash]);
      setOpenModalTransactionSubmitting(false);
    }
  }, [depositTransaction])

  useEffect(() => {
    if(approveTransaction.transactionHash) {
      setTransactionHashes([...transactionHashes, approveTransaction.transactionHash]);
      setOpenModalTransactionSubmitting(false);
    }
  }, [approveTransaction])

  useEffect(() => {
    if(widthdrawTransaction.transactionHash) {
      setTransactionHashes([...transactionHashes, widthdrawTransaction.transactionHash]);
      setOpenModalTransactionSubmitting(false);
    }
  }, [widthdrawTransaction])

  useEffect(() => {
    if(_.isEmpty(userInfo) || _.isEmpty(withdrawFee)) return
    dispatch(getWithdrawFee(loginInvestor.wallet_address, userInfo.staked));
    setPenaltyPercent(Math.round(parseFloat(withdrawFee) * 100 / parseFloat(userInfo.staked)))
  }, [withdrawFee, userInfo])

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
      {openModalDeposit && <ModalDeposit
        setOpenModalDeposit={setOpenModalDeposit}
        setOpenModalTransactionSubmitting={setOpenModalTransactionSubmitting}
        token={tokenDetails}
      />}
      {openModalWithdraw && <ModalWithdraw
        setOpenModalWithdraw={setOpenModalWithdraw}
        token={tokenDetails}
      />}
      {openModalTransactionSubmitting && <div className={commonStyles.loadingTransaction}>
        <div className="content">
          <img src={iconClose} onClick={e => setOpenModalTransactionSubmitting(false)}/>
          <span className={commonStyles.nnb1824d}>Transaction Submitting</span>
          <LinearProgress color="primary" />
        </div>
      </div>}

      {transactionHashes.length == 0 && <ModalTransaction
        transactionHashes={transactionHashes}
        setTransactionHashes={setTransactionHashes}
      />}
    </div>
  );
};

export default ManageTier;
