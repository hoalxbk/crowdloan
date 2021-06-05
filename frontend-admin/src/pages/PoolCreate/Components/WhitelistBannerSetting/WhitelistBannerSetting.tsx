import React from 'react';
import WhitelistLink from "./WhitelistLink";
import GuideLink from "./GuideLink";
import AnnouncementTime from "./AnnouncementTime";
import useStyles from "../../style";

function WhitelistBannerSetting(props: any) {
  const classes = useStyles();
  const {
    register, setValue, errors, watch, control,
    poolDetail,
  } = props;

  return (
    <div className={classes.exchangeRate}>
      <WhitelistLink
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <GuideLink
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />

      <AnnouncementTime
        poolDetail={poolDetail}
        register={register}
        setValue={setValue}
        errors={errors}
        control={control}
        watch={watch}
      />
    </div>
  );
}

export default WhitelistBannerSetting;
