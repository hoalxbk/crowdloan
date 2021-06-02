import React, {useEffect} from 'react';
import useStyles from "../style";
import {isValidAddress} from "../../../services/web3";
import {renderErrorCreatePool} from "../../../utils/validate";
import {useCommonStyle} from "../../../styles";
import {etherscanRoute} from "../../../utils";
import Link from "@material-ui/core/Link";

function AddressReceiveMoney(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, errors, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.address_receiver) {
      setValue('addressReceiver', poolDetail.address_receiver);
    }
  }, [poolDetail]);

  const isDeployed = !!poolDetail?.is_deploy;

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Address (Receive money)</label>
        {isDeployed &&
          <div className={commonStyle.boldText}>
            <Link href={etherscanRoute(poolDetail?.address_receiver, poolDetail)} target={'_blank'}>
              {poolDetail?.address_receiver}
            </Link>
          </div>
        }

        {!isDeployed &&
          <>
            <input
              type="text"
              name="addressReceiver"
              ref={register({
                required: needValidate,
                validate: {
                  validAddress: (val: any) => {
                    if (!needValidate) return true;
                    return isValidAddress(val);
                  }
                }
              })}
              maxLength={255}
              className={classes.formControlInput}
              disabled={isDeployed}
            />
            <p className={classes.formErrorMessage}>
              {
                renderError(errors, 'addressReceiver')
              }
            </p>
          </>
        }
      </div>
    </>
  );
}

export default AddressReceiveMoney;
