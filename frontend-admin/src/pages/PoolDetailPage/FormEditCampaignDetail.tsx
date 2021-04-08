import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Link } from "react-router-dom";
import DatePicker from 'react-date-picker';
import useStyles from './styles';
import { useCommonStyle } from '../../styles';

const FormEditCampaignDetail = (props: any) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle();
  const [formDetail] = useState(props.formDetail);

  const formatTime = (date: any) => {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
  }

  const [startDate, setStartDate] = useState(new Date(formDetail?.start_time));
  const [finishTime, setFinishTime] = useState(new Date(formDetail?.finish_time));
  const [affiliate, setAffiliate] = useState(formDetail?.affiliate);

  const { register, errors, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      title_campaign: formDetail.title_campaign,
      token_address: formDetail.token_address,
      start_time: formDetail.start_time,
      finish_time: formDetail.finish_time,
      address_receive_money: formDetail.address_receive_money,
      affiliate: formDetail.affiliate,
      you_get: formDetail.you_get,
      for: formDetail.for,
    },
  });

  useEffect(() => {
    if(startDate) {
      setValue('start_time', formatTime(startDate))
    }
  }, [startDate]);

  useEffect(() => {
    if(finishTime) {
      setValue('finish_time', formatTime(finishTime))
    }
  }, [finishTime]);

  const onSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <>
      <form className={styles.formShow} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>Campaign name</label>
          <input
            className={styles.inputG}
            name="title_campaign"
            placeholder=""
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.title_campaign && <span className="error">This field is required</span>}
        </div>
        <div className="clearfix"></div>
        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>Token address</label>
          <input
            className={styles.inputG}
            name="token_address"
            placeholder=""
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.token_address && <span className="error">This field is required</span>}
        </div>
        <div className="clearfix"></div>
        <div className={styles.groupShowTime}>
          <label className={styles.inputLabel}>Start time</label>
          <DatePicker
            className={commonStyle.DatePicker}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            onChange={(date: any) => setStartDate(date)}
            value={startDate}
            calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
          />
          <input
            style={{ display: 'none' }}
            className={styles.inputG}
            name="start_time"
            placeholder=""
            ref={register({ required: false })}
          />
        </div>
        <div className={styles.lineTimeEdit}></div>
        <div className={styles.groupShowTime}>
          <label className={styles.inputLabel}>Finish time</label>
          <DatePicker
            className={commonStyle.DatePicker}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            onChange={(date: any) => setFinishTime(date)}
            value={finishTime}
            minDate={startDate}
            calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
          />
          <input
            style={{ display: 'none' }}
            className={styles.inputG}
            name="finish_time"
            placeholder=""
            ref={register({ required: false })}
          />
        </div>
        <div className="clearfix"></div>
        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>Address (Receive money)</label>
          <input
            className={styles.inputG}
            name="address_receive_money"
            placeholder=""
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.address_receive_money && <span className="error">This field is required</span>}
        </div>
        <div className="clearfix"></div>
        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>Affiliate</label>
          <FormControlLabel
            control={
              <Checkbox
                checked={affiliate}
                onChange={() => setAffiliate(!affiliate)}
                icon={<img src="/images/icon_not_check.svg" alt="" />}
                checkedIcon={<img src="/images/icon_check.svg" alt="" />}
                name="checkedB"
                color="primary"
              />
            }
            label={affiliate ? 'Yes' : 'No'}
          />
          {!formDetail?.affiliate && <Link to="#" className={styles.registerAffiliate}>Register now</Link>}
          <input
            style={{ display: 'none' }}
            className={styles.inputG}
            name="affiliate"
            placeholder=""
            ref={register({ required: false })}
          />
        </div>
        <div className="clearfix"></div>
        <div className={styles.groupShow}>
          <label className={styles.nameGroupShow}>Exchange Rates</label>
          <div className={styles.groupShowRate}>
            <div className={styles.groupRate}>
              <label className={styles.nameGroupRate}>You get*</label>
              <div className={styles.boxInputGroupRateYouGet}>
                <input
                  className={styles.inputG}
                  name="you_get"
                  placeholder=""
                  ref={register({ required: false })}
                />
                <div className="unit">ETH</div>
              </div>
            </div>
            <img className={styles.iconTransfer} src="/images/icon-transfer.svg" alt="" />
            <div className={styles.groupRate}>
              <label className={styles.nameGroupRate}>For</label>
              <div className={styles.boxInputGroupRateYouGet + ' for'}>
                <input
                  className={styles.inputG}
                  name="for"
                  placeholder=""
                  ref={register({ required: false })}
                />
                <div className="unit">BS</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.listBtn}>
          <Button 
            type="submit"
            className={styles.btnSubmit}>
              Submit
          </Button>
          <Button 
            className={styles.btnCancel}
            onClick={() => props.setEditCampaignDetail(false)}>
              Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormEditCampaignDetail; 