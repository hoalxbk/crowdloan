import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function WhitelistLink(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues, needValidate,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  // const isDeployed = !!poolDetail?.is_deploy;

  useEffect(() => {
    if (poolDetail && poolDetail.whitelistBannerSetting) {
    }
  }, [poolDetail]);


  return (
    <>
      <div className={classes.formControl}>
        <label className={classes.formControlLabel}>Whitelist Link</label>
        <input
          type="text"
          name="whitelist_link"
          defaultValue={poolDetail?.whitelistBannerSetting?.whitelist_link}
          ref={register({
            // required: true
          })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'whitelist_link')
          }
        </p>
      </div>
    </>
  );
}

export default WhitelistLink;
