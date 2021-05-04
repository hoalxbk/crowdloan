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
import useAuth from '../../../hooks/useAuth';
//@ts-ignore
import AnimatedNumber from "animated-number-react";
import { numberWithCommas } from '../../../utils/formatNumber';
import { timeAgo } from '../../../utils/convertDate';
import { USER_STATUS } from '../../../constants';

const iconClose = '/images/icons/close.svg'

const ManageTier = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const dispatch = useDispatch()

  const [openModalDeposit, setOpenModalDeposit] = useState(false)
  const [openModalWithdraw, setOpenModalWithdraw] = useState(false)
  const [openModalTransactionSubmitting, setOpenModalTransactionSubmitting] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState([]) as any;


  const { data: depositTransaction, error: depositError } = useSelector((state: any) => state.deposit);
  const { data: approveTransaction, error: approveError } = useSelector((state: any) => state.approve);
  const { data: withdrawTransaction, error: withdrawError } = useSelector((state: any) => state.withdraw);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { connectedAccount, isAuth, wrongChain } = useAuth();

  const { 
    classNamePrefix = '',
    emailVerified,
    listTokenDetails
  } = props;

  const handleKYC = () => {
    console.log('hande KYC')
  }

  useEffect(() => {
    dispatch(getWithdrawPercent());
  }, [])

  useEffect(() => {
    if(depositTransaction.hash) {
      setTransactionHashes([...transactionHashes, depositTransaction.hash]);
      setOpenModalTransactionSubmitting(false);
    }
    if(depositError.message) setOpenModalTransactionSubmitting(false);
  }, [depositTransaction, depositError])

  useEffect(() => {
    if(approveTransaction.hash) {
      setTransactionHashes([...transactionHashes, approveTransaction.hash]);
      setOpenModalTransactionSubmitting(false);
    }
    if(approveError.message) setOpenModalTransactionSubmitting(false);
  }, [approveTransaction, approveError])

  useEffect(() => {
    if(withdrawTransaction.hash) {
      setTransactionHashes([...transactionHashes, withdrawTransaction.hash]);
      setOpenModalTransactionSubmitting(false);
    }
    if(withdrawError.message) setOpenModalTransactionSubmitting(false);
  }, [withdrawTransaction, withdrawError])

  const renderToken = (symbol: string, balance: any, staked: any) => {
    return <div className="group">
      <span>{symbol}</span>
      {(wrongChain || !isAuth) && <AnimatedNumber
        value={0}
        formatValue={numberWithCommas}
      />}
      {!wrongChain && isAuth && <AnimatedNumber
        value={balance}
        formatValue={numberWithCommas}
      />}
      {(wrongChain || !isAuth) && <AnimatedNumber
        value={0}
        formatValue={numberWithCommas}
      />}
      {!wrongChain && isAuth && <AnimatedNumber
        value={staked}
        formatValue={numberWithCommas}
      />}
    </div>
  }

  return (
    <div className={`${classNamePrefix}__component`}>
      <div className={styles.content}>
        <div className={styles.manageTier}>
          <p className={styles.textDefault}>Available balance</p>
          <div className="button-area">
            <button
              className={`btn btn-lock ${(emailVerified == USER_STATUS.UNVERIFIED || wrongChain || !isAuth) ? 'disabled' : ''}`}
              onClick={() => {setOpenModalDeposit(true)}}
              disabled={emailVerified == USER_STATUS.UNVERIFIED || wrongChain || !isAuth}
            >
              Lock - in
            </button>
            <button
              className={`btn btn-unlock ${(emailVerified == USER_STATUS.UNVERIFIED || wrongChain || !isAuth) ? 'disabled' : ''}`}
              onClick={() => {setOpenModalWithdraw(true)}}
              disabled={emailVerified == USER_STATUS.UNVERIFIED || wrongChain || !isAuth}
            >
              Unlock
            </button>
          </div>
        </div>
        <div className={styles.walletBalance}>
          <div className={styles.tableHead}>
            <div className="group">
              <span>Currency</span>
              <span>Available Balance</span>
              <span>Locked-in</span>
            </div>
          </div>
          <div className={styles.tableBody}>
            {renderToken(listTokenDetails[0]?.symbol, balance?.pkf, userInfo?.pkfStaked)}
            {renderToken(listTokenDetails[1]?.symbol, balance?.uni, userInfo?.uniStaked)}
            {renderToken(listTokenDetails[2]?.symbol, balance?.mantra, userInfo?.mantraStaked)}
          </div>
        </div>

        {/* <p className={styles.balance}>
          {(wrongChain || !isAuth) && <AnimatedNumber
            value={0}
            formatValue={numberWithCommas}
          />}
          {!wrongChain && isAuth && <AnimatedNumber
            value={balance.token}
            formatValue={numberWithCommas}
          />}
          &nbsp;{tokenDetails?.symbol}
        </p> */}
      </div>
      {openModalDeposit && <ModalDeposit
        setOpenModalDeposit={setOpenModalDeposit}
        setOpenModalTransactionSubmitting={setOpenModalTransactionSubmitting}
        listTokenDetails={listTokenDetails}
      />}
      {openModalWithdraw && <ModalWithdraw
        setOpenModalWithdraw={setOpenModalWithdraw}
        setOpenModalTransactionSubmitting={setOpenModalTransactionSubmitting}
        listTokenDetails={listTokenDetails}
      />}
      {openModalTransactionSubmitting && <div className={commonStyles.loadingTransaction}>
        <div className="content">
          <img src={iconClose} onClick={() => setOpenModalTransactionSubmitting(false)}/>
          <span className={commonStyles.nnb1824d}>Transaction Submitting</span>
          <LinearProgress color="primary" />
        </div>
      </div>}

      {transactionHashes.length > 0 && <ModalTransaction
        transactionHashes={transactionHashes}
        setTransactionHashes={setTransactionHashes}
      />}
    </div>
  );
};

export default ManageTier;
