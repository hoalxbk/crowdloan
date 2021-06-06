import React from 'react';
import BuyRemainTokensButton from "./BuyRemainTokensButton";
import ApproveButton from "./ApproveButton";
import {ACCEPT_CURRENCY} from "../../../../constants";
import useStyles from "../../style";

function BuyTokens(props: any) {
  const classes = useStyles();
  const {
    setValue, errors, control, watch,
    poolDetail
  } = props;
  const acceptCurrency = watch('acceptCurrency');
  const isDeployed = !!poolDetail?.is_deploy;

  if (!isDeployed) return <></>;

  return (
    <>
      <div className={classes.formControl}>

      <label className={classes.formControlLabel}>Buy Remain Tokens</label>
      {acceptCurrency !== ACCEPT_CURRENCY.ETH &&
        <ApproveButton
          poolDetail={poolDetail}
          setValue={setValue}
          errors={errors}
          control={control}
          watch={watch}
        />
      }

      <BuyRemainTokensButton
        poolDetail={poolDetail}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
      </div>
    </>
  );
}

export default BuyTokens;
