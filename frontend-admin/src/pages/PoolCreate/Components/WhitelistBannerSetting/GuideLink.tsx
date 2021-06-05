import React, {useEffect} from 'react';
import useStyles from "../../style";
import {renderErrorCreatePool} from "../../../../utils/validate";

function GuideLink(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, getValues,
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
        <label className={classes.formControlLabel}>Guide Link</label>
        <input
          type="text"
          name="guide_link"
          defaultValue={poolDetail?.whitelistBannerSetting?.guide_link}
          ref={register({
            // required: true
          })}
          maxLength={255}
          className={classes.formControlInput}
        />
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'guide_link')
          }
        </p>
      </div>
    </>
  );
}

export default GuideLink;
