import React from 'react';

import useStyles from './style';
import DatePicker from "react-date-picker";
import {useCommonStyle} from "../../styles";
import {debounce} from "lodash";

const SearchForm = (props: any) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();
  const {
    startTime, setStartTime,
    finishTime, setFinishTime,
    setCurrentPage, handleCampaignSearch,
  } = props;
  const delayCampaignSearch = debounce(handleCampaignSearch, 500);

  return (
    <>
      <div className={classes.headerRight}>
        <DatePicker
          className={commonStyle.DatePicker}
          monthPlaceholder="mm"
          dayPlaceholder="dd"
          yearPlaceholder="yy"
          calendarIcon={<img src="/images/icon-calendar.svg" alt="calendar-icon" />}
          value={startTime}
          onChange={(date: any) => { setStartTime(date); setCurrentPage(1) }}
        />
        <img className={commonStyle.iconLine} src="/images/icon-line.svg" alt="" />
        <DatePicker
          className={commonStyle.DatePicker}
          monthPlaceholder="mm"
          dayPlaceholder="dd"
          yearPlaceholder="yy"
          calendarIcon={<img src="/images/icon-calendar.svg" alt="calendar-icon" />}
          value={finishTime}
          onChange={(date: any) => { setFinishTime(date); setCurrentPage(1) }}
        />
        <div className={commonStyle.boxSearch}>
          <input className={commonStyle.inputSearch} onChange={delayCampaignSearch} placeholder="Search" />
          <img className={commonStyle.iconSearch} src="/images/icon-search.svg" alt="" />
        </div>
      </div>
    </>
  )
};

export default SearchForm;
