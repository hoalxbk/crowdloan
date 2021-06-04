import React from 'react';
import BuyRemainTokensButton from "./BuyRemainTokensButton";
import ApproveButton from "./ApproveButton";
import {ACCEPT_CURRENCY} from "../../../../constants";

function BuyTokens(props: any) {
  const {
    setValue, errors, control, watch,
    poolDetail
  } = props;
  const acceptCurrency = watch('acceptCurrency');
  const isDeployed = !!poolDetail?.is_deploy;

  if (!isDeployed) return <></>;

  return (
    <>
      <BuyRemainTokensButton
        poolDetail={poolDetail}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
      {acceptCurrency !== ACCEPT_CURRENCY.ETH &&
        <ApproveButton
          poolDetail={poolDetail}
          setValue={setValue}
          errors={errors}
          control={control}
          watch={watch}
        />
      }


    </>
  );
}

export default BuyTokens;
