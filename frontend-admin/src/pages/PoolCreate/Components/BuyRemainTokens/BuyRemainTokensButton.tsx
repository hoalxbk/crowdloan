import React, {useEffect, useState} from 'react';
import useStyles from "../../style";
import {useDispatch, useSelector} from "react-redux";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {getAbiPool, getContractInstance, getErc20Contract, getPoolContract} from "../../../../services/web3";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {Button} from "@material-ui/core";
import {
  ACCEPT_CURRENCY,
  NETWORK_AVAILABLE, POOL_TYPE,
  USDC_ADDRESS,
  USDC_BSC_ADDRESS,
  USDT_ADDRESS,
  USDT_BSC_ADDRESS
} from "../../../../constants";
import BigNumber from 'bignumber.js';
import {depositPoolAdmin} from "../../../../request/pool";
import {buyTokenWithSignature} from "../../../../utils/campaign";

function BuyRemainTokensButton(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    setValue, errors, control, watch,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;
  const { data: loginUser } = useSelector(( state: any ) => state.user);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(false);

  useEffect(() => {
    if (poolDetail && poolDetail.campaign_hash) {


    }
  }, [poolDetail]);

  const isDeployed = !!poolDetail?.is_deploy;
  const acceptCurrency = watch('acceptCurrency');
  const networkAvailable = watch('networkAvailable');

  const getCurrencyAddress = (network: string, currency: string) => {
    if (network == NETWORK_AVAILABLE.ETH) {
      if (currency == ACCEPT_CURRENCY.USDT) {
        return USDT_ADDRESS;
      } else if (currency == ACCEPT_CURRENCY.USDC) {
        return USDC_ADDRESS;
      } else { // ACCEPT_CURRENCY.ETH
        return '0x00';
      }
    } else if (network == NETWORK_AVAILABLE.BSC) {
      if (currency == ACCEPT_CURRENCY.USDT) {
        return USDT_BSC_ADDRESS;
      } else if (currency == ACCEPT_CURRENCY.USDC) {
        return USDC_BSC_ADDRESS;
      } else { // BNB
        return '0x00';
      }
    }
  };

  const buyRemainTokens = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want buy remain tokens?')) {
      return false;
    }
    try {
      setLoading(true);

      let tokenDecimal;
      if (acceptCurrency == ACCEPT_CURRENCY.ETH) {
        tokenDecimal = 18;
      } else {
        const currencyAddress = getCurrencyAddress(networkAvailable, acceptCurrency);
        const ercContract = getErc20Contract({ networkAvailable, erc20TokenAddress: currencyAddress });
        if (!ercContract) {
          throw Error('ERC20 Contract is null');
        }
        tokenDecimal = await ercContract.methods.decimals().call();
      }

      // const contract = await getPoolContract({
      //   networkAvailable,
      //   poolHash: poolDetail.campaign_hash,
      //   isClaimable: poolDetail.pool_type == POOL_TYPE.CLAIMABLE,
      // });

      const ABI = getAbiPool(poolDetail.pool_type == POOL_TYPE.CLAIMABLE);
      const contract = await getContractInstance(
        ABI,
        poolDetail.campaign_hash,
        networkAvailable == NETWORK_AVAILABLE.ETH,
      );

      if (!contract) {
        throw Error('Pool Contract is null');
      }

      let availableTokenForSale = await contract.methods.getAvailableTokensForSale().call();
      availableTokenForSale = new BigNumber(availableTokenForSale || 0).div(Math.pow(10, tokenDecimal)).toFixed();
      console.log('availableTokenForSale', availableTokenForSale);

      let response = await depositPoolAdmin({
        minBuy: '0',
        maxBuy: new BigNumber(availableTokenForSale).multipliedBy(Math.pow(10, tokenDecimal)),
        userWalletAddress: loginUser.wallet_address,
        campaignId: poolDetail.id
      });
      response = response.data || {};
      console.log('[buyRemainTokens] - Response depositPoolAdmin ', response);
      debugger;

      const buyResponse = await buyTokenWithSignature({
        isClaimable: poolDetail.type === 'claimable',
        poolAddress: poolDetail.campaign_hash,
        acceptCurrency: poolDetail.accept_currency,
        amount: availableTokenForSale,
        signature: response.signature,
        minBuy: response.min_buy,
        maxBuy: response.max_buy,
        networkAvailable: poolDetail.network_available,
        poolContract: contract,
        userWalletAddress: loginUser.wallet_address,
        rate: poolDetail.ether_conversion_rate
      });

      console.log('buyResponse', buyResponse);
      setTransactionHash(buyResponse.transactionHash);

      setLoading(false);
      dispatch(alertSuccess('Buy Success !!!'));
    } catch (e) {
      console.log('ERROR: ', e);
      setLoading(false);
      dispatch(alertFailure('Buy Fail !!!'));
      return false;
    }
  };

  return (
    <>

      <Button
        variant="contained"
        color="primary"
        onClick={buyRemainTokens}
      >Buy Remain Tokens</Button>

      {loading &&
        (<div>Loading....</div>)
      }
      {transactionHash &&
        <div>
          Transaction Hash: {transactionHash}
        </div>
      }
    </>
  );
}

export default BuyRemainTokensButton;
