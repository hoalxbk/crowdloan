import React, { Dispatch, SetStateAction, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';
import NumberFormat from 'react-number-format';

import TransactionSubmitModal from '../../../components/Base/TransactionSubmitModal';
import Button from '../Button';
import useStyles from './style';

import { getUSDCAddress, getUSDTAddress } from '../../../utils/contractAddress/getAddresses';
import { numberWithCommas } from '../../../utils/formatNumber';
import { BSC_CHAIN_ID } from '../../../constants/network';
import { PurchaseCurrency } from '../../../constants/purchasableCurrency';
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

const REGEX_NUMBER = /^-?[0-9]{0,}[.]{0,1}[0-9]{0,6}$/;

type BuyTokenFormProps = {
  tokenDetails: TokenType | undefined,
  rate: number | undefined,
  poolAddress: string | undefined;
  maximumBuy: number;
  minimumBuy: number;
  poolAmount: number | undefined;
  purchasableCurrency: string | undefined;
  poolId: number | undefined;
  joinTime: Date | undefined;
  method: string | undefined;
  availablePurchase: boolean | undefined;
  ableToFetchFromBlockchain: boolean | undefined
  minTier: number | undefined
  isDeployed: boolean | undefined
  endBuyTimeInDate: Date | undefined
  startBuyTimeInDate: Date | undefined
  endJoinTimeInDate: Date | undefined
  tokenSold: string | undefined
  setBuyTokenSuccess: Dispatch<SetStateAction<boolean>> 
}  

enum MessageType {
  error = 'error',
  warning = 'warning'
}

const BuyTokenForm: React.FC<BuyTokenFormProps> = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [openApproveModal, setApproveModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [estimateTokens, setEstimateTokens] = useState<number>(0);
  const [tokenAllowance, setTokenAllowance] = useState<number | undefined>(undefined);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [userPurchased, setUserPurchased] = useState<number>(0);
  const [poolBalance, setPoolBalance] = useState<number>(0);
  const [loadingPoolInfo, setLoadingPoolInfo] = useState<boolean>(false);

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
    minimumBuy,
    poolAmount,
    startBuyTimeInDate,
    endJoinTimeInDate,
    tokenSold,
    setBuyTokenSuccess
  } = props;

  const { connectedAccount, wrongChain } = useAuth();
  const userTier = useTypedSelector(state => state.userTier).data;
  const { appChainID, walletChainID } = useTypedSelector(state => state.appNetwork).data;
  const connector = useTypedSelector(state => state.connector).data;

  const { 
    deposit, 
    tokenDepositLoading, 
    tokenDepositTransaction,
    depositError,
    tokenDepositSuccess
  } = usePoolDepositAction({ poolAddress, poolId, purchasableCurrency, amount: input });

  const { retrieveTokenAllowance } = useTokenAllowance();
  const { retrieveUserPurchased } = useUserPurchased(tokenDetails, poolAddress, ableToFetchFromBlockchain);

  const getApproveToken = useCallback((appChainID: string) => {
    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.USDT) {
      return {
        address: getUSDTAddress(appChainID),
        name: "USDT",
        symbol: "USDT",
        decimals: 6 
      };
    }

    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.USDC) {
      return {
        address: getUSDCAddress(appChainID),
        name: "USDC",
        symbol: "USDC",
        decimals: 6 
      };
    }

    if (purchasableCurrency && purchasableCurrency === PurchaseCurrency.ETH) {
      return {
        address: "0x00",
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      }
    }
  }, [purchasableCurrency, appChainID])

  const tokenToApprove = getApproveToken(appChainID); 

  const { approveToken, tokenApproveLoading, transactionHash } = useTokenApprove(
    tokenToApprove,
    connectedAccount, 
    poolAddress,
    false
  );

  const { retrieveTokenBalance } = useTokenBalance(tokenToApprove, connectedAccount); 

  // Check if user already buy ICO token at the first time or not ?
  const firstBuy = localStorage.getItem('firstBuy') || undefined;
  let parsedFirstBuy = {} as any;
  if (firstBuy) {
    try {
      parsedFirstBuy = JSON.parse(firstBuy);
    }
    catch (err) {
      console.log(err.message);
    }
  }
  const connectedAccountFirstBuy = 
    connectedAccount 
    ? ( 
       parsedFirstBuy[poolAddress] ? parsedFirstBuy[poolAddress][connectedAccount]: false 
    )
    : false;

  const availableMaximumBuy = useMemo(() => {
    const maxBuy = new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate));

    /* if (availableTokensToCurrency.lt(maxBuy)) { */
    /*   return availableTokensToCurrency.multipliedBy(new BigNumber(1).div(rate)).toFixed(); */
    /* } */
    
    /* if (availableTokensToCurrency.gt(maxBuy)) { */
    /* } */

    if (maxBuy.gt(new BigNumber(tokenBalance))) {
      return new BigNumber(tokenBalance).toFixed();
    }

    return maxBuy.toFixed();
  }, [tokenBalance, maximumBuy, userPurchased, poolAmount, tokenSold, rate]);

  const poolErrorBeforeBuy = useMemo(() => {
    const timeToShowMsg = new Date() > endJoinTimeInDate && new Date() < startBuyTimeInDate;

    if (
      poolBalance 
      && poolAmount 
      && startBuyTimeInDate 
      && endJoinTimeInDate && 
      new BigNumber(poolAmount).gt(0) &&
      new BigNumber(poolBalance).lt(new BigNumber(poolAmount)) && 
      timeToShowMsg
    ) {
      return { 
        message: `This pool is not ready to buy, please contact the administrator for more information.`,
        type: MessageType.warning
      };
    }

    if (minimumBuy && input && new BigNumber(input || 0).lt(minimumBuy) && !connectedAccountFirstBuy && new Date() > startBuyTimeInDate) {
      return { 
        message: `The minimum amount you must trade is ${minimumBuy} ${purchasableCurrency}.`,
        type: MessageType.error
      }
    }

    if (
      input && 
      new BigNumber(estimateTokens).gt(new BigNumber(poolAmount)) 
    ) {
      return {
        message: `You can only buy  up to ${numberWithCommas(`${new BigNumber(poolAmount).minus(new BigNumber(userPurchased)).toFixed()}`)} RED HOA .`,
        type: MessageType.error
      }
    }

    return;
  }, [
    minimumBuy, 
    estimateTokens,
    poolBalance, 
    poolAmount, 
    userPurchased,
    purchasableCurrency, 
    input, 
    startBuyTimeInDate, 
    endJoinTimeInDate, 
    connectedAccountFirstBuy
  ]);

  let enableApprove = false;

  if (tokenAllowance != null || tokenAllowance != undefined) {
    if ((tokenAllowance <= 0 || new BigNumber(tokenAllowance).lt(new BigNumber(input)))  
    && (purchasableCurrency && purchasableCurrency !== PurchaseCurrency.ETH) 
    && !wrongChain && ableToFetchFromBlockchain && isDeployed
    )  {
      enableApprove = true;
    }
  }

  // Check whether current user's tier is valid or not
  const validTier = new BigNumber(userTier).gte(minTier);

  const purchasable = 
     availablePurchase 
     && estimateTokens > 0 
     && (purchasableCurrency !== PurchaseCurrency.ETH ? new BigNumber(input).lte(new BigNumber(maximumBuy)): new BigNumber(input).lte(tokenBalance))
     && !poolErrorBeforeBuy
     && new BigNumber(input).lte(new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate)))
     && new BigNumber(estimateTokens).lte(new BigNumber(poolAmount).minus(tokenSold))
     && new BigNumber(tokenBalance).gte(new BigNumber(input))
     && !wrongChain
     && validTier    
     && ((purchasableCurrency !== PurchaseCurrency.ETH ? new BigNumber(tokenAllowance || 0).gt(0): true));

  // Fetch User balance
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

  const fetchPoolDetails = useCallback(async () => {
      if (tokenDetails && poolAddress && connectedAccount && tokenToApprove) {
        setTokenAllowance(await retrieveTokenAllowance(tokenToApprove, connectedAccount, poolAddress) as number);
        setUserPurchased(await retrieveUserPurchased(connectedAccount, poolAddress) as number);
        setTokenBalance(await retrieveTokenBalance(tokenToApprove, connectedAccount) as number);
        setWalletBalance(await retrieveTokenBalance(tokenDetails, connectedAccount) as number);
        setPoolBalance(await retrieveTokenBalance(tokenDetails, poolAddress) as number);
      }

  }, [tokenDetails, connectedAccount, tokenToApprove, poolAddress]);

  useEffect(() => {
    const fetchPoolDetailsBlockchain = async () => {
      await fetchPoolDetails();
      setLoadingPoolInfo(false);
    }

    loadingPoolInfo && fetchPoolDetailsBlockchain();
  }, [loadingPoolInfo]);

  // Handle for fetching pool general information 1 time
  useEffect(() => {
    const fetchTokenPoolAllowance = async () => {
      try {
        setLoadingPoolInfo(true);
      } catch (err) { 
        setLoadingPoolInfo(false);
      }    
    }

    ableToFetchFromBlockchain && connectedAccount && fetchTokenPoolAllowance();
  }, [connectedAccount, ableToFetchFromBlockchain]);

  // Check if has any error when deposit => close modal
  useEffect(() => {
    if (depositError) {
      setOpenSubmitModal(false);
    }
  }, [depositError]);

  // Re-fetch user balance when deposit successful
  useEffect(() => {
    const handleWhenDepositSuccess = async () => {
      setBuyTokenSuccess(true);
      await fetchUserBalance();
      await fetchPoolDetails();
    }

    tokenDepositSuccess && handleWhenDepositSuccess();
  }, [tokenDepositSuccess]);

  useEffect(() => {
    if (tokenDepositTransaction) {
      //  Clear input field and additional information field below and close modal
      setInput("");
      setEstimateTokens(0);

      if (!connectedAccountFirstBuy) {
        localStorage.setItem("firstBuy", JSON.stringify(Object.assign({}, {
          ...parsedFirstBuy,
          [poolAddress as string]: {
            ...parsedFirstBuy[poolAddress],
            [connectedAccount as string]: true
          }
        })));
      }
    }
  }, [tokenDepositTransaction, connectedAccountFirstBuy]);

  useEffect(() => {
    if (input && rate && purchasableCurrency) {
      const tokens = new BigNumber(input).multipliedBy(new BigNumber(1).div(rate)).toNumber()
      setEstimateTokens(tokens);
    } else {
      setEstimateTokens(0);
    }
  }, [input, purchasableCurrency, rate]);

  const handleInputChange = async (e: any) => {
    const value = e.target.value.replaceAll(",", "");
    if (value === '' || REGEX_NUMBER.test(value)) {
      setInput(value);
    }
  }

  const handleTokenDeposit = async () => {
    try {
      if (purchasableCurrency && ableToFetchFromBlockchain) {
        setOpenSubmitModal(true);
        setBuyTokenSuccess(false);

        // Call to smart contract to deposit token and refetch user balance
        await deposit();
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
            You have {numberWithCommas(new BigNumber(userPurchased).multipliedBy(rate).toFixed())} {purchasableCurrency} BOUGHT from {numberWithCommas(maximumBuy)} {purchasableCurrency} available for your TIER. 
            The remaining amount is {numberWithCommas(new BigNumber(maximumBuy).minus(new BigNumber(userPurchased).multipliedBy(rate)).toFixed())} {purchasableCurrency}.
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

          <NumberFormat 
            className={styles.buyTokenInput} 
            placeholder={'0'} 
            thousandSeparator={true}  
            onChange={handleInputChange} 
            decimalScale={6}
            value={input} 
            max={tokenBalance}
            min={0}
            maxLength={255}
            disabled={wrongChain}
          />
          <span className={styles.purchasableCurrency}>
            <button 
              className={styles.purchasableCurrencyMax} 
              onClick={() => setInput(availableMaximumBuy)}
            >
              Max
            </button>
            <img src={`/images/${purchasableCurrency}.png`} alt={purchasableCurrency} className={styles.purchasableCurrencyIcon} />
            {purchasableCurrency}
          </span>
        </div>
      </div>
      <p className={styles.buyTokenFee}>
        Your Balance: {numberWithCommas(`${walletBalance || 0}` )} {tokenDetails?.symbol}
      </p>
      <div className={styles.buyTokenEstimate}>
        <p className={styles.buyTokenEstimateLabel}>You will get approximately</p>
        <strong className={styles.buyTokenEstimateAmount}>{numberWithCommas(`${estimateTokens}`)} {tokenDetails?.symbol}</strong>
      </div>
      {
        <p className={`${poolErrorBeforeBuy?.type === MessageType.error ? `${styles.poolErrorBuy}`: `${styles.poolErrorBuyWarning}`}`}>
          {poolErrorBeforeBuy && poolErrorBeforeBuy.message}          
        </p>
      }
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
        handleClose={() => { setOpenSubmitModal(false); }} 
        transactionHash={tokenDepositTransaction}
      />
      <TransactionSubmitModal 
        opened={openApproveModal} 
        handleClose={() => { setApproveModal(false); }} 
        transactionHash={transactionHash}
      />
    </div>
  )
}

export default withWidth()(BuyTokenForm);
