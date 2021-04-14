import React, {useEffect} from 'react';
import useStyles from "../style";
import {isValidAddress} from "../../../services/web3";
import {renderErrorCreatePool} from "../../../utils/validate";

function AddressReceiveMoney(props: any) {
  const classes = useStyles();
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

  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Address (Receive money)</label>
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
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'addressReceiver')
          }
        </p>
      </div>
    </>
  );
}

export default AddressReceiveMoney;
