import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { approve } from '../../../store/actions/sota-token';
import { deposit } from '../../../store/actions/sota-tiers';
import { convertFromWei, convertToWei, convertToBN } from '../../../services/web3';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

const closeIcon = '/images/icons/close.svg';
const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

const ModalDeposit = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [depositAmount, setDepositAmount] = useState('');
  const [disableDeposit, setDisableDeposit] = useState(true);

  const { data: allowance = 0 } = useSelector((state: any) => state.allowance);
  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { account: connectedAccount, library } = useWeb3React();

  const {
    setOpenModalDeposit,
    setOpenModalTransactionSubmitting,
    listTokenDetails
  } = props;
  const [currentToken, setCurrentToken] = useState(listTokenDetails[0]) as any;
  const [currentBalance, setCurrentBalance] = useState('0');
  const [currentStaked, setCurrentStaked] = useState('0');

  useEffect(() => {
    setCurrentBalance(balance.pkf)
    setCurrentStaked(userInfo.pkfStaked)
  }, [balance, userInfo])

  useEffect(() => {
    if(depositAmount === '' || depositAmount === '0') {
      setDisableDeposit(true)
      return
    }
    if(!connectedAccount) return
    if(!isNaN(parseFloat(currentBalance))
      && !isNaN(parseFloat(depositAmount)))
    {
      const tokenBalance = new BigNumber(currentBalance).multipliedBy(new BigNumber(10).pow(18))
      const amount = new BigNumber(depositAmount).multipliedBy(new BigNumber(10).pow(18))
      const zero = new BigNumber('0')
      setDisableDeposit(tokenBalance.lt(amount) || amount.lte(zero))
    }
  }, [connectedAccount, balance, depositAmount, currentToken]);

  const onDeposit = () => {
    if(disableDeposit) return
    dispatch(deposit(connectedAccount, depositAmount, library));
    setOpenModalTransactionSubmitting(true);
    setOpenModalDeposit(false);
  }

  const onApprove = () => {
    dispatch(approve(connectedAccount, library));
    setOpenModalTransactionSubmitting(true);
    setOpenModalDeposit(false);
  }

  const handleClose = () => {
    setOpenModalDeposit(false);
  }

  const handleSelectToken = (e: any) => {
    const tokens = listTokenDetails.filter((tokenDetails: any) => {
      return tokenDetails.symbol == e.target.value
    })
    setCurrentToken(tokens[0])
    if(e.target.value == 'PKF') {
      setCurrentBalance(balance.pkf)
      setCurrentStaked(userInfo.pkfStaked)
    } else if(e.target.value == 'UPKF') {
      setCurrentBalance(balance.uni)
      setCurrentStaked(userInfo.uniStaked)
    } else if(e.target.value == 'MPKF') {
      setCurrentBalance(balance.mantra)
      setCurrentStaked(userInfo.mantraStaked)
    }
  }

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalDeposit}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={handleClose}/>
            <h2 className="title">You have {currentStaked} {currentToken?.symbol} locked-in</h2>
          </div>
          <div className="modal-content__body">
            <select name="select_token" id="select-token" onChange={(e) => handleSelectToken(e)}>
              {listTokenDetails && listTokenDetails.map((tokenDetails: any) => {
                return <option value={tokenDetails?.symbol}>{tokenDetails?.symbol}</option>
              })}
            </select>

            <div className="subtitle">
              <span>Input</span>
              <span>Your wallet balance: { _.isEmpty(balance) ? 0 : parseFloat(currentBalance).toFixed(2) } {currentToken?.symbol}</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={depositAmount}
                onChange={e => (e.target.value === '' || REGEX_NUMBER.test(e.target.value)) && setDepositAmount(e.target.value)}
                placeholder="0.00"
              />
              <div>
                <button className="btn-max" onClick={() => setDepositAmount(currentBalance)}>MAX</button>
              </div>
            </div>
          </div>
          <div className="modal-content__foot">
            {allowance <= 0 && <button
              className={"btn-approve"}
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