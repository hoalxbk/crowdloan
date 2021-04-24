import React, {useEffect} from 'react';
import useStyles from "../style";
import {isValidAddress} from "../../../services/web3";
import {renderErrorCreatePool} from "../../../utils/validate";
import {useCommonStyle} from "../../../styles";

function AddressReceiveMoney(props: any) {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    register, setValue, errors,
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
          <div className={commonStyle.boldText}>{poolDetail?.address_receiver}</div>
        }

        {!isDeployed &&
          <>
            <input
              type="text"
              name="addressReceiver"
              ref={register({
                required: true,
                validate: {
                  validAddress: (val: any) => isValidAddress(val)
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
