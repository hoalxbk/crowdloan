import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { gt } from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { withdraw, getWithdrawFee } from '../../../store/actions/sota-tiers';
import { convertFromWei, convertToWei, convertToBN } from '../../../services/web3';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

const closeIcon = '/images/icons/close.svg';
const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

const ModalWithdraw = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const commonStyles = useCommonStyle();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [disableWithdraw, setDisableWithdraw] = useState(true);

  const { data: userInfo = {} } = useSelector((state: any) => state.userInfo);
  const { data: withdrawFee = {} } = useSelector((state: any) => state.withdrawFee);
  const { account: connectedAccount, library } = useWeb3React();

  const {
    setOpenModalWithdraw,
    setOpenModalTransactionSubmitting,
    listTokenDetails
  } = props;
  const [currentToken, setCurrentToken] = useState(listTokenDetails[0]) as any;
  const [currentStaked, setCurrentStaked] = useState('0');

  useEffect(() => {
    setCurrentStaked(userInfo.pkfStaked)
  }, [userInfo])

  const onWithDraw = () => {
    if(disableWithdraw) return
    dispatch(withdraw(connectedAccount, withdrawAmount, library, currentToken.address));
    setOpenModalTransactionSubmitting(true);
    setOpenModalWithdraw(false);
  }

  const handleClose = () => {
    setOpenModalWithdraw(false);
  }

  useEffect(() => {
    if(withdrawAmount === '' || withdrawAmount === '0') {
      setDisableWithdraw(true)
      return
    }
    if(!connectedAccount) return
    if(!isNaN(parseFloat(currentStaked))
      && !isNaN(parseFloat(withdrawAmount)))
    {
      const staked = new BigNumber(currentStaked).multipliedBy(new BigNumber(10).pow(18))
      const amount = new BigNumber(withdrawAmount).multipliedBy(new BigNumber(10).pow(18))
      const zero = new BigNumber('0')
      setDisableWithdraw(staked.lt(amount) || amount.lte(zero));
    }
  }, [connectedAccount, userInfo, withdrawAmount, currentToken]);

  useEffect(() => {
    dispatch(getWithdrawFee(connectedAccount, withdrawAmount === '' ? '0' : withdrawAmount))
  }, [withdrawAmount])

  const handleSelectToken = (e: any) => {
    const tokens = listTokenDetails.filter((tokenDetails: any) => {
      return tokenDetails.symbol == e.target.value
    })
    setCurrentToken(tokens[0])
    if(e.target.value == 'PKF') {
      setCurrentStaked(userInfo.pkfStaked)
    } else if(e.target.value == 'UPKF') {
      setCurrentStaked(userInfo.uniStaked)
    } else if(e.target.value == 'MPKF') {
      setCurrentStaked(userInfo.mantraStaked)
    }
  }

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalWithdraw}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={handleClose}/>
            <h2 className="title">You have {currentStaked} {currentToken?.symbol} locked-in</h2>
          </div>
          <div className="modal-content__body">
            <select name="select_token" id="select-token" onChange={(e) => handleSelectToken(e)}>
              {listTokenDetails && listTokenDetails.map((tokenDetails: any, index: number) => {
                return <option value={tokenDetails?.symbol} key={index}>{tokenDetails?.symbol}</option>
              })}
            </select>
            <div className={styles.group}>
              <div className="subtitle">
                <span>Input</span>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={e => (e.target.value === '' || REGEX_NUMBER.test(e.target.value)) && setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                />
                <div>
                  <button className="btn-max" id="btn-max-withdraw" onClick={() => setWithdrawAmount(currentStaked)}>MAX</button>
                </div>
              </div>
              <div className="balance">
                <div>
                  <span>Your wallet staked</span>
                  <span>{ _.isEmpty(userInfo) ? 0 : parseFloat(currentStaked).toFixed() } {currentToken?.symbol}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-content__foot">
            <button
              className={"btn-staking " + (disableWithdraw ? 'disabled' : '')}
              onClick={onWithDraw}
            >Unlock</button>
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
