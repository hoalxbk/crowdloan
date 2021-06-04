import React, {useEffect, useState} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";
import {Button} from "@material-ui/core";
import {getErc20Contract} from "../../../../services/web3";
import {useDispatch, useSelector} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {convertAmountToUsdt} from "../../../../utils/usdt";
import {
  ACCEPT_CURRENCY,
  NETWORK_AVAILABLE,
  USDC_ADDRESS,
  USDC_BSC_ADDRESS,
  USDT_ADDRESS,
  USDT_BSC_ADDRESS
} from "../../../../constants";

function ApproveButton(props: any) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    setValue, errors, control, watch,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(false);
  const { data: loginUser } = useSelector(( state: any ) => state.user);

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

  const approve = async () => {
    const allowanceAmount = '10000000000000000000000';
    const poolHash = poolDetail?.campaign_hash;
    setLoading(true);
    try {
      const currencyAddress = getCurrencyAddress(networkAvailable, acceptCurrency);
      const ercContract = getErc20Contract({ networkAvailable, erc20TokenAddress: currencyAddress });

      if (ercContract) {
        const walletAddress = loginUser.wallet_address;
        const decimals  = await ercContract.methods.decimals().call();
        const allowance  = await ercContract.methods.allowance(walletAddress, poolHash).call();
        // if(!isAllowanceUsdt(decimals, amount, allowance)) {
          const amountApprove = convertAmountToUsdt(decimals, allowanceAmount).toFixed();
          const approve  = await ercContract.methods.approve(poolHash, amountApprove).send({
            from: walletAddress,
          });
          if (approve) {
            dispatch(alertSuccess('Approve Success'));
            setTransactionHash(approve.transactionHash);
          } else {
            dispatch(alertSuccess('Approve Success'));
          }
        // }
      }
      setLoading(false);
    } catch (e) {
      console.log('ERROR: ', e);
      dispatch(alertFailure('Approve Fail !!!'));
      setLoading(false);
    }
  };

  return (
    <>
      <br/>
      <div>

        <Button
          variant="contained"
          color="primary"
          onClick={approve}
          style={{
            marginTop: 20,
            marginBottom: 10
          }}
        >Approve</Button>

        {loading &&
          (<div>Loading....</div>)
        }
        {transactionHash &&
          <div>
            Transaction Hash: {transactionHash}
          </div>
        }


      </div>
    </>
  );
}

export default ApproveButton;
