import React, {useState} from 'react';
import useStyles from "../style";
import Tooltip from "@material-ui/core/Tooltip";
import {ACCEPT_CURRENCY} from "../../../constants";
import BigNumber from "bignumber.js";

function ExchangeRateUsdtRow(props: any) {
  const styles = useStyles();
  const {
    poolDetail, poolDetails, key,
  } = props;
  const [showRateReserveUSDT, setShowRateReverseUSDT] = useState<boolean>(false);


  const tokenDetails = poolDetails?.tokenDetails;
  const reverseRate = `1 ${tokenDetails.symbol} = ${poolDetails.priceUsdt} USDT`;
  const displayRate = `1 USDT = ${new BigNumber(1).div(poolDetails.priceUsdt).toNumber()} ${tokenDetails?.symbol}`;

  console.log('reverseRate', reverseRate);
  console.log('displayRate', displayRate);


  return (
    <>
      <div className={styles.poolDetailBasic} key={key}>
        <span className={styles.poolDetailBasicLabel}>{poolDetail.label}</span>
        <p className={styles.poolsDetailBasicText}>
          <Tooltip title={<p style={{ fontSize: 15 }}>{displayRate}</p>}>
            <span>
              {poolDetails?.purchasableCurrency != ACCEPT_CURRENCY.ETH &&
                <>
                  NOTETH--USDT--
                  {/*{poolDetails?.purchasableCurrency}--{key}-{displayRate}---*/}

                  {showRateReserveUSDT ? reverseRate : displayRate}
                </>
              }

              {poolDetails?.purchasableCurrency === ACCEPT_CURRENCY.ETH &&
                <>
                  {showRateReserveUSDT ? reverseRate : displayRate}
                </>
              }

            </span>
          </Tooltip>
          <img
            src={poolDetail.utilIcon}
            className={styles.poolDetailUtil}
            onClick={() => {
              setShowRateReverseUSDT(!showRateReserveUSDT);
            }}
            key={key}
          />
        </p>
      </div>
    </>
  );
}

export default ExchangeRateUsdtRow;
