import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';

import TransactionSubmitModal from '../../../components/Base/TransactionSubmitModal';
import Button from '../Button';
import useStyles from './style';

import { numberWithCommas, getDigitsAfterDecimals, INTEGER_NUMBER_KEY_CODE_LIST } from '../../../utils/formatNumber';
import { isNotValidASCIINumber, isPreventASCIICharacters, trimLeadingZerosWithDecimal } from '../../../utils/formatNumber';
import { BSC_CHAIN_ID } from '../../../constants/network';
import { TokenType } from '../../../hooks/useTokenDetails';
import getAccountBalance from '../../../utils/getAccountBalance';
import { connectWalletSuccess } from '../../../store/actions/wallet';

import { useTypedSelector } from '../../../hooks/useTypedSelector';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useTokenAllowance from '../../../hooks/useTokenAllowance';
import useUserPurchased from '../hooks/useUserPurchased';
import usePoolDepositAction from '../hooks/usePoolDepositAction';
import useTokenApprove from '../../../hooks/useTokenApprove';
import useAuth from '../../../hooks/useAuth';
import { withWidth, isWidthDown, isWidthUp } from '@material-ui/core';

type BuyTokenFormProps = {
  tokenDetails: TokenType | undefined,
  rate: number | undefined,
  poolAddress: string | undefined;
  maximumBuy: number;
  purchasableCurrency: string | undefined;
  poolId: number | undefined;
  joinTime: Date | undefined;
  method: string | undefined;
  availablePurchase: boolean | undefined;
  ableToFetchFromBlockchain: boolean | undefined
  minTier: number | undefined
  isDeployed: boolean | undefined
}

const USDT_ADDRESS = process.env.REACT_APP_USDT_SMART_CONTRACT;
const USDC_ADDRESS = process.env.REACT_APP_USDC_SMART_CONTRACT;

const BuyTokenForm: React.FC<BuyTokenFormProps> = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [openApproveModal, setApproveModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [transactionFee, setTransactionFee] = useState<number>(0);
  const [estimateTokens, setEstimateTokens] = useState<number>(0);
  const [tokenAllowance, setTokenAllowance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [userPurchased, setUserPurchased] = useState<number>(0);

  const { 
    tokenDetails, 
    rate, 
    poolAddress, 
    maximumBuy, 
    purchasableCurrency,
    poolId,
    availablePurchase,
    ableToFetchFromBlockchain,
    minTier,
    isDeployed,
  } = props;

  const { connectedAccount, wrongChain } = useAuth();
  const userTier = useTypedSelector(state => state.userTier).data;
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const connector = useTypedSelector(state => state.connector).data;

  const { 
    deposit, 
    estimateErr, 
    tokenDepositLoading, 
    tokenDepositTransaction,
    setTokenDepositLoading,
    depositError
  } = usePoolDepositAction({ poolAddress, poolId, purchasableCurrency, amount: input });

  const { retrieveTokenAllowance } = useTokenAllowance();
  const { retrieveUserPurchased } = useUserPurchased(tokenDetails, poolAddress, ableToFetchFromBlockchain);

  const getApproveToken = useCallback(() => {
    if (purchasableCurrency && purchasableCurrency === "USDT") {
      return {
        address: USDT_ADDRESS as string,
        name: "USDT",
        symbol: "USDT",
        decimals: 6 
      };
    }

    if (purchasableCurrency && purchasableCurrency === "USDC") {
      return {
        address: USDC_ADDRESS as string,
        name: "USDC",
        symbol: "USDC",
        decimals: 6 
      };
    }

    if (purchasableCurrency && purchasableCurrency === 'ETH') {
      return {
        address: "0x00",
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      }
    }
  }, [purchasableCurrency])

  const tokenToApprove = getApproveToken(); 

  const { approveToken, tokenApproveLoading, transactionHash, setTokenApproveLoading } = useTokenApprove(
    tokenToApprove,
    connectedAccount, 
    poolAddress,
    false
  );

  const { retrieveTokenBalance } = useTokenBalance(tokenToApprove, connectedAccount); 

  const enableApprove = 
    (tokenAllowance <= 0 || new BigNumber(tokenAllowance).lt(new BigNumber(input)))  
    && (purchasableCurrency && purchasableCurrency !== 'ETH') 
    && !wrongChain && ableToFetchFromBlockchain && isDeployed;

  // Plus one for userTier because tier in smart contract start by 0  
  const validTier = minTier && new BigNumber(userTier + 1).gte(minTier);
  const purchasable = 
    ((purchasableCurrency !== 'ETH' ? tokenAllowance > 0: true) 
     && !estimateErr 
     && availablePurchase 
     && estimateTokens > 0 
     && (purchasableCurrency !== 'ETH' ? input <= maximumBuy: new BigNumber(input).lte(tokenBalance))
     && !wrongChain
     && validTier    
    );


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
      if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
        setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, poolAddress) as number);
        setUserPurchased(await retrieveUserPurchased(connectedAccount, poolAddress) as number);
        setTokenBalance(await retrieveTokenBalance(tokenToApprove, connectedAccount) as number);
        setWalletBalance(await retrieveTokenBalance(tokenDetails, connectedAccount) as number);
      }
    }

    ableToFetchFromBlockchain && fetchTokenPoolAllowance();
  }, [tokenDetails, connectedAccount, tokenToApprove, poolAddress, ableToFetchFromBlockchain]);

  useEffect(() => {
    if (depositError) {
      setOpenSubmitModal(false);
    }
  }, [depositError]);

  useEffect(() => {
    if (tokenDepositTransaction) {
      //  Clear input field and additional information field below and close modal
      setInput("");
      setEstimateTokens(0);
      setTransactionFee(0);
    }
  }, [tokenDepositTransaction]);

  const handleInputChange = async (e: any) => {
    const val = e.target.value;
    setInput(val);

    if (!isNaN(val) && val && rate && purchasableCurrency && availablePurchase) {
      const tokens = new BigNumber(val).multipliedBy(new BigNumber(1).div(rate)).toNumber()
      setEstimateTokens(tokens);
      /* const estimatedFee = await estimateFee(val, purchasableCurrency) */ 
      /* estimatedFee && setTransactionFee(estimatedFee); */
    } else {
      setEstimateTokens(0);
      setTransactionFee(0);
    }
  }

  const handleTokenDeposit = async () => {
    try {
      if (purchasableCurrency && ableToFetchFromBlockchain) {
        setOpenSubmitModal(true);

        // Call to smart contract to deposit token and refetch user balance
        await deposit();
        await fetchUserBalance();
      }
    } catch (err) {
      setOpenSubmitModal(false);
    }
  }

  const handleTokenApprove = async () => {
    try {
      setApproveModal(true);
      await approveToken();
      setInput("");

      if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
        setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, poolAddress) as number);
        setTokenBalance(await retrieveTokenBalance(tokenToApprove, connectedAccount) as number);
      }
    } catch (err) {
      setApproveModal(false);
    }
  }

  return (
    <div className={styles.buyTokenForm}>
      {
        appChainID !== BSC_CHAIN_ID && (
          <p className={styles.buyTokenFormTitle}>
            You have {new BigNumber(userPurchased).multipliedBy(rate).toFixed()} {purchasableCurrency} BOUGHT from {maximumBuy} available for your TIER. <br/> 
            The remaining amount is {new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate)).toFixed()}
          </p>
        ) 
      }
      <div className={styles.buyTokenInputForm}>
        <p className={styles.buyTokenInputLabel}>
          <span>Input</span>
          {isWidthUp('sm', props.width) && <span>Your wallet balance:&nbsp;
            {numberWithCommas(parseFloat(tokenBalance.toString()).toFixed(6))} &nbsp;
            {purchasableCurrency}
          </span>}
          {isWidthDown('xs', props.width) && <span>Balance:&nbsp;
            {numberWithCommas(parseFloat(tokenBalance.toString()).toFixed(6))} &nbsp;
            {purchasableCurrency}
          </span>}
        </p>
        <div className={styles.buyTokenInputWrapper}>
          <input 
            type="text" 
            className={styles.buyTokenInput} 
            placeholder={'0'} 
            onChange={handleInputChange} 
            value={input} 
            onKeyDown={e => { 
              if (getDigitsAfterDecimals(input) >= 6 && INTEGER_NUMBER_KEY_CODE_LIST.indexOf(e.keyCode) < 0) {
                e.preventDefault();
                return;
              }

              isNotValidASCIINumber(e.keyCode, true) && e.preventDefault() 
            }}
            onKeyPress={e => isPreventASCIICharacters(e.key) && e.preventDefault()}
            onBlur={e => setInput(trimLeadingZerosWithDecimal(e.target.value))}
            onPaste={e => {
              const pastedText = e.clipboardData.getData('text');

              if (isNaN(Number(pastedText))) {
                e.preventDefault();
              }
            }}
            max={tokenBalance}
            min={0}
            maxLength={255}
            disabled={wrongChain}
          />
          <span>{purchasableCurrency}</span>
        </div>
      </div>
      <p className={styles.buyTokenFee}>
        {
          (estimateErr && input) ? 'Error when estimate gas': `Transaction Fee: ~${transactionFee} ETH`
        }
      </p>
      <p className={styles.buyTokenFee}>
        Your Balance: {numberWithCommas(`${walletBalance || 0}` )} {tokenDetails?.symbol}
      </p>
      <div className={styles.buyTokenEstimate}>
        <p className={styles.buyTokenEstimateLabel}>You will get approximately</p>
        <strong className={styles.buyTokenEstimateAmount}>{estimateTokens} Tokens</strong>
      </div>
      <div className={styles.btnGroup}>
        <Button 
        text={'Approve'} 
        backgroundColor={'#29C08A'} 
        disabled={!enableApprove} 
        onClick={handleTokenApprove} 
        loading={tokenApproveLoading} 
        />
        <Button 
          text={'Buy'} 
          backgroundColor={'#3232DC'} 
          disabled={!purchasable}
          onClick={handleTokenDeposit}
          loading={tokenDepositLoading} 
        />
      </div>
      <TransactionSubmitModal 
        opened={openSubmitModal} 
        handleClose={() => { setOpenSubmitModal(false); setTokenDepositLoading(false)}} 
        transactionHash={tokenDepositTransaction}
      />
      <TransactionSubmitModal 
        opened={openApproveModal} 
        handleClose={() => { setApproveModal(false); setTokenApproveLoading(false)}} 
        transactionHash={transactionHash}
      />
    </div>
  )
}

export default withWidth()(BuyTokenForm);
