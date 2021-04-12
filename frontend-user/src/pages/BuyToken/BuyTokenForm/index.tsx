import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import TransactionSubmitModal from '../../../components/Base/TransactionSubmitModal';
import Button from '../Button';
import useStyles from './style';

import { limitDecimalFormatter, formatMoneyWithoutDollarSign } from '../../../utils/currencyFormatter';
import { TokenType } from '../../../hooks/useTokenDetails';
import getAccountBalance from '../../../utils/getAccountBalance';
import { connectWalletSuccess } from '../../../store/actions/wallet';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import useTokenAllowance from '../../../hooks/useTokenAllowance';
import useUserPurchased from '../hooks/useUserPurchased';
import usePoolDepositAction from '../hooks/usePoolDepositAction';

type BuyTokenFormProps = {
  tokenDetails: TokenType | undefined,
  balance: number,
  approveToken: () => void;
  tokenApproveLoading: boolean,
  rate: number,
  poolAddress: string;
  maximumBuy: number
}

const BuyTokenForm: React.FC<BuyTokenFormProps> = (props: BuyTokenFormProps) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [input, setInput] = useState("");
  const [transactionFee, setTransactionFee] = useState<number>(0);
  const [estimateTokens, setEstimateTokens] = useState<number>(0);
  const [tokenAllowance, setTokenAllowance] = useState<number>(0);
  const [userPurchased, setUserPurchased] = useState<number>(0);

  const { 
    tokenDetails, 
    balance, 
    rate, 
    poolAddress, 
    maximumBuy, 
    approveToken, 
    tokenApproveLoading 
  } = props;

  const { retrieveTokenAllowance } = useTokenAllowance();
  const { retrieveUserPurchased } = useUserPurchased(tokenDetails);
  const { 
    deposit, 
    estimateFee, 
    estimateErr, 
    tokenDepositLoading, 
    tokenDepositTransaction,
    setTokenDepositLoading
  } = usePoolDepositAction({ poolAddress });
  const { account: connectedAccount } = useWeb3React();
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const connector = useTypedSelector(state => state.connector).data;

  const fetchUserBalance = useCallback(async () => {
      if (appChainID && connectedAccount && connector) {
        const accountBalance = await getAccountBalance(appChainID, walletChainID, connectedAccount as string, connector);

        dispatch(
          connectWalletSuccess(
            connector, 
            [connectedAccount], 
            { 
              [connectedAccount]: new BigNumber(accountBalance._hex).div(new BigNumber(10).pow(18)).toFixed(5) 
            }
          )
        )
      }
  }, [connector, appChainID, walletChainID, connectedAccount]);

  useEffect(() => {
    const fetchTokenPoolAllowance = async () => {
      if (tokenDetails && poolAddress && connectedAccount) {
        setTokenAllowance(await retrieveTokenAllowance(tokenDetails, connectedAccount, poolAddress) as number);
        setUserPurchased(await retrieveUserPurchased(connectedAccount, poolAddress) as number);
      }
    }

    fetchTokenPoolAllowance();
  }, [tokenDetails, connectedAccount, poolAddress]);

  const handleInputChange = async (e: any) => {
    const val = e.target.value;
    setInput(val);

    if (!isNaN(val) && val) {
      const tokens = new BigNumber(val).multipliedBy(rate).toNumber()
      setEstimateTokens(tokens);
      const estimatedFee = await estimateFee(val) 
      estimatedFee && setTransactionFee(estimatedFee);
    } else {
      setEstimateTokens(0);
      setTransactionFee(0);
    }
  }

  const handleTokenDeposit = async () => {
    try {
      setOpenSubmitModal(true);

      // Call to smart contract to deposit token and refetch user balance
      await deposit(input);
      await fetchUserBalance();

      //  Clear input field and additional information field below and close modal
      setInput("");
      setEstimateTokens(0);
      setTransactionFee(0);
    } catch (err) {
      setOpenSubmitModal(false);
    }
  }

  return (
    <div className={styles.buyTokenForm}>
      <p className={styles.buyTokenFormTitle}>You have {userPurchased} {tokenDetails?.symbol} DEPOSITED from {maximumBuy} available for your TIER</p>
      <div className={styles.buyTokenInputForm}>
        <p className={styles.buyTokenInputLabel}>
          <span>Input</span>
          <span>Your wallet balance:&nbsp;
            {formatMoneyWithoutDollarSign(limitDecimalFormatter.format(balance))} 
            {tokenDetails?.symbol}
          </span>
        </p>
        <div className={styles.buyTokenInputWrapper}>
          <input 
            type="text" 
            className={styles.buyTokenInput} 
            placeholder={'0'} 
            onChange={handleInputChange} 
            value={input} 
          />
          <span>{tokenDetails?.symbol}</span>
        </div>
      </div>
      <p className={styles.buyTokenFee}>
        {
          (estimateErr && input) ? 'Error when estimate gas': `Transaction Fee: ~${transactionFee} ETH`
        }
      </p>
      <div className={styles.buyTokenEstimate}>
        <p className={styles.buyTokenEstimateLabel}>You will get approximately</p>
        <strong className={styles.buyTokenEstimateAmount}>{estimateTokens} Tokens</strong>
      </div>
      <div className={styles.btnGroup}>
        <Button 
        text={'Approve'} 
        backgroundColor={'#29C08A'} 
        disabled={tokenAllowance > 0} 
        onClick={approveToken} 
        loading={tokenApproveLoading} 
        />
        <Button 
          text={'Deposit'} 
          backgroundColor={'#D01F36'} 
          disabled={(tokenAllowance <= 0 || estimateErr !== "")} 
          onClick={handleTokenDeposit}
          loading={tokenDepositLoading} 
        />
      </div>
      <TransactionSubmitModal 
        opened={openSubmitModal} 
        handleClose={() => { setOpenSubmitModal(false); setTokenDepositLoading(false)}} 
        transactionHash={tokenDepositTransaction}
      />
    </div>
  )
}

export default BuyTokenForm;
