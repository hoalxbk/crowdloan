import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Tooltip } from '@material-ui/core';
import { useForm } from 'react-hook-form';
//@ts-ignore
import DateTimePicker from 'react-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { debounce } from 'lodash';
import BigNumber from 'bignumber.js';

import { useCommonStyle } from '../../styles';
import useStyles from './style';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import ButtonLink from '../../components/Base/ButtonLink';
import { createCampaign } from '../../store/actions/campaign';
import { getTokenInfo, TokenType } from '../../utils/token';
import { isValidAddress } from '../../services/web3';
import { isFactorySuspended } from '../../utils/campaignFactory';
import { isNotValidASCIINumber, isPreventASCIICharacters, trimLeadingZerosWithDecimal } from '../../utils/formatNumber';
import {adminRoute} from "../../utils";

const CreateCampaign: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const classes = useStyles();
  const commonStyle = useCommonStyle();

  const [isSuspend, setIsSuspend] = useState(true);
  const [ startTime, setStartTime ] = useState<Date | null>(null);
  const [ finishTime, setFinishTime ] = useState<Date | null>(null);
  const [ releaseTime, setReleaseTime ] = useState<Date | null>(null);

  const dispatch = useDispatch();

  const { loading } = useSelector(( state: any ) => state.campaignCreate);
  const [token, setToken] = useState<TokenType | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  useEffect(() => {
    const checkCampaignFactorySuspended = async () => {
      const isSuspended = await isFactorySuspended();

      setIsSuspend(isSuspended);
    }

    checkCampaignFactorySuspended();
  }, []);

  const { register, setValue, clearErrors, errors, handleSubmit } = useForm({
    mode: "onChange",
  });

  const handleFormSubmit = async (data: any) => {
    const { title, start_time, finish_time, release_time, token: tokenAddress, addressReceiver, tokenByETH, affiliate } = data;

    const history = props.history;

    dispatch(createCampaign({
      title,
      startTime: start_time,
      finishTime: finish_time,
      releaseTime: release_time,
      token: tokenAddress,
      tokenInfo: token,
      addressReceiver,
      tokenByETH,
      affiliate: 'no',
    }, history));
  };

  const handleCampaignCreate = () => {
    handleSubmit(handleFormSubmit)();
  };

  const handleTokenGetInfo = debounce(async (e: any) => {
    try {
      setToken(null);
      setLoadingToken(true);

      const tokenAddress = e.target.value;
      const erc20Token = await getTokenInfo(tokenAddress);

      if (erc20Token) {
        const { name, symbol, decimals, address } = erc20Token;
        setLoadingToken(false);
        setToken({
          name,
          symbol,
          decimals,
          address
        });
      }
    } catch (err) {
      setLoadingToken(false);
    };
  }, 500);

  const checkMaxEthRateDecimals = (amount: any) => {
    let validMaxAmountDecimals = true;
    const decimalsAmountBuyUnit = 8;
    if (amount.includes('.')) {
      const amountSplit = amount.split('.');
      const amountDecimals = amountSplit.pop();
      if (amountDecimals.length > decimalsAmountBuyUnit) {
        validMaxAmountDecimals = false;
      }
    }

    return validMaxAmountDecimals;
  };

  const renderError = (errors: any, prop: string) => {
    if (errors[prop]) {
      const errorName = prop.split("_").join(' ');
      const errorType = errors[prop].type;

      switch (errorType) {

        case 'required': {
          return 'This field is required';
        }

        case 'greaterOrEqualToday': {
          return `The ${errorName} must be after current date.`;
        }

        case 'greateOrEqualStartTime': {
          return 'This finish time must be after the start time';
        }

        case 'greaterOrEqualFinishTime': {
          return 'This relase time must be after the finish time';
        }

        case 'validAddress': {
          return "Address receive is invalid.";
        }

        case 'invalidToken': {
          return errors[prop].message;
        }

        case 'tokenAlreadyUsed': {
          return 'Token address is already in use.';
        }
      };
    }

    return;
  };

  const renderErrorMinMax = (errors: any, prop: string, min: number, max: number = 100) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required';
      } else if (errors[prop].type === "min") {
        return `This field must be greater than ${min}`;
      } else if (errors[prop].type === "max") {
        return `This field must be less than ${max}`;
      } else if (errors[prop].type === 'maxDecimals') {
        return `Decimals can not greater than 8`;
      }

    }
  }

  const handleDatePicking = (datePicker: string, selectedDate: Date | Date[]) => {
    if (selectedDate) {
      clearErrors(datePicker);
    };

    setValue(datePicker, selectedDate);
  };

  const goBack = () => {
    const { history } = props;
    history.goBack();
  };

  return (
    <DefaultLayout>
      <ButtonLink onClick={goBack} spacing={6} to={adminRoute('/campaigns')} text="Back" icon="icon-arrow-left.svg" />
      <div className= {classes.container}>
        <form className={classes.form}>
          <div className={classes.formControl}>
            <label className={classes.formControlLabel}>Campaign Name</label>
            <input
              type="text"
              name="title"
              ref={register({
                required: true
              })}
              maxLength={255}
              className={classes.formControlInput}
            />
            <p className={classes.formErrorMessage}>
              {
                renderError(errors, 'title')
              }
            </p>
          </div>
          <div className={classes.formControl}>
            <label className={classes.formControlLabel}>Token address</label>
            <div className={classes.formControlInputLoading}>
              <input
                type="text"
                name="token"
                ref={register({
                  required: true,
                  validate: {
                    invalidToken: async (val: string) => {
                      try {
                        const erc20Token = await getTokenInfo(val);

                        return erc20Token;
                      } catch (err) {
                        return err.message;
                      }
                    },
                  }
                })}
                maxLength={255}
                onChange={handleTokenGetInfo}
                className={classes.formControlInput}
              />
              {
                loadingToken ?
                  <div className={classes.circularProgress}>
                    <CircularProgress size={25} />
                  </div> : (
                    errors['token'] && (errors['token'].type === 'tokenAlreadyUsed' || errors['token'].type === 'invalidToken') ? <img src="/images/icon_close.svg" className={classes.loadingTokenIcon} /> : (token && <img src="/images/icon_check.svg" className={classes.loadingTokenIcon} />
                  ))
              }
            </div>
            <p className={`${classes.formErrorMessage}`}>
              {
                renderError(errors, 'token')
              }
            </p>
          </div>
            {
              token && (
                <div className={classes.tokenInfo}>
                  <div className="tokenInfoBlock">
                    <span className="tokenInfoLabel">Token</span>
                    <div className="tokenInfoContent">
                      <img src="/images/eth.svg" alt="erc20" />
                      <Tooltip title={<p style={{ fontSize: 15 }}>{token.name}</p>}>
                        <p className="tokenInfoText wordBreak">{`${token.name}`}</p>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="tokenInfoBlock">
                    <span className="tokenInfoLabel">Token Symbol</span>
                    <div className="tokenInfoContent">
                      <Tooltip title={<p style={{ fontSize: 15 }}>{token.symbol}</p>}>
                        <p className="wordBreak">{`${token.symbol}`}</p>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="tokenInfoBlock">
                    <span className="tokenInfoLabel">Token Decimals</span>
                    <div className="tokenInfoContent">
                      {`${token.decimals}`}
                    </div>
                  </div>
                </div>
              )
            }
          <div className={classes.formControlFlex}>
            <div className={classes.formControlFlexBlock}>
              <label className={classes.formControlLabel}>Start time</label>
              <DateTimePicker
                className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                monthPlaceholder="mm"
                dayPlaceholder="dd"
                yearPlaceholder="yy"
                calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
                value={startTime}
                onChange={(date: any) => { handleDatePicking("start_time", date); setStartTime(date) }}
              />
              <input
                type="hidden"
                name="start_time"
                ref={register({
                  required: true,
                  validate: {
                    greaterOrEqualToday: value => new Date(value) >= new Date()
                  }
                })}
              />
              <p className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
                {
                  renderError(errors, 'start_time')
                }
              </p>
            </div>
            <img className={classes.formControlIcon} src="/images/icon-line.svg" alt="" />
            <div className={classes.formControlFlexBlock}>
              <label className={classes.formControlLabel}>Finish time</label>
              <DateTimePicker
                className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                monthPlaceholder="mm"
                dayPlaceholder="dd"
                yearPlaceholder="yy"
                calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
                value={finishTime}
                onChange={(date: any) => { handleDatePicking("finish_time", date); setFinishTime(date) }}
              />
              <input
                type="hidden"
                name="finish_time"
                ref={register({
                  required: true,
                  validate: {
                    greateOrEqualStartTime: value => startTime ? new Date(value) > startTime: new Date(value)> new Date()
                  }
                })}
              />
              <p className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
                {
                  renderError(errors, 'finish_time')
                }
              </p>
            </div>
          </div>
          <div className={classes.formControl}>
            <label className={classes.formControlLabel}>Release time</label>
            <DateTimePicker
              className={`${commonStyle.DateTimePicker} ${classes.formDatePicker} ${classes.formDatePickerBlock}`}
              monthPlaceholder="mm"
              dayPlaceholder="dd"
              yearPlaceholder="yy"
              calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
              value={releaseTime}
              onChange={(date: any) => { handleDatePicking("release_time", date); setReleaseTime(date) }}
            />
            <input
              type="hidden"
              name="release_time"
              ref={register({
                required: true,
                validate: {
                  greaterOrEqualFinishTime: value => finishTime ? new Date(value) > finishTime: new Date(value)> new Date()
                }
              })}
            />
            <p className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
              {
                renderError(errors, 'release_time')
              }
            </p>
          </div>
          <div className={classes.formControl}>
            <label className={classes.formControlLabel}>Address (Receive money)</label>
            <input
              type="text"
              name="addressReceiver"
              ref={register({
                required: true,
                validate: {
                  validAddress: val => isValidAddress(val)
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
          {/*<div className={classes.formControl}>*/}
          {/*  <label className={classes.formControlLabel}>Affiliate</label>*/}
          {/*  <select*/}
          {/*    className={classes.formControlInput}*/}
          {/*    name="affiliate"*/}
          {/*    ref={register({*/}
          {/*      required: true*/}
          {/*    })}*/}
          {/*    defaultValue=""*/}
          {/*  >*/}
          {/*    <option value="">Select a value</option>*/}
          {/*    <option value="yes">Yes</option>*/}
          {/*    <option value="no">No</option>*/}
          {/*  </select>*/}
          {/*  <p className={classes.formErrorMessage}>*/}
          {/*    {*/}
          {/*      renderError(errors, 'affiliate')*/}
          {/*    }*/}
          {/*  </p>*/}
          {/*</div>*/}
        </form>
        <div className={classes.exchangeRate}>
          <Typography className={classes.exchangeRateTitle}>Exchange Rates</Typography>
          <div className={classes.formControlFlex}>
            <div className={classes.formControlFlexBlock}>
                <label className={`${classes.formControlLabel} ${classes.formControlBlurLabel}`}>You have</label>
                <div className={classes.formControlRate}>
                  <input
                    type="number"
                    name="ethFor"
                    disabled={true}
                    value={1}
                    className={`${classes.formInputBox} ${classes.formInputBoxEther}`}
                  />
                  <button className={classes.box}>ETH</button>
                </div>
            </div>
            <img className={classes.formControlIcon} src="/images/icon-exchange.svg" alt="" />
            <div className={classes.formControlFlexBlock}>
                <label className={`${classes.formControlLabel} ${classes.formControlBlurLabel}`}>You get*</label>
                <div className={classes.formControlRate}>
                  <input
                    type="text"
                    name="tokenByETH"
                    ref={register({
                      required: true,
                      validate: {
                        min: value => new BigNumber(value).comparedTo(0) > 0,
                        maxDecimals: checkMaxEthRateDecimals
                      }
                    })}
                    maxLength={255}
                    onKeyDown={(e: any) => isNotValidASCIINumber(e.keyCode, true) && e.preventDefault()}
                    onKeyPress={(e: any) => isPreventASCIICharacters(e.key) && e.preventDefault()}
                    onBlur={(e: any) => setValue('tokenByETH', trimLeadingZerosWithDecimal(e.target.value))}
                    onPaste={(e: any) => {
                      const pastedText = e.clipboardData.getData("text");

                      if (isNaN(Number(pastedText))) {
                        e.preventDefault();
                      }
                    }}
                    className={`${classes.formInputBox} ${classes.formInputBoxBS}`}
                  />
                    <Tooltip title={token?.symbol || ""}>
                      <button className={`${classes.box} ${classes.boxEther}`}>
                          {token?.symbol || ""}
                      </button>
                    </Tooltip>
                  <p className={`${classes.formErrorMessage} ${classes.formErrorMessageAbsolute}`}>
                    {
                      renderErrorMinMax(errors, 'tokenByETH', 0, 100)
                    }
                  </p>
                </div>
            </div>
          </div>
          <p className={classes.exchangeRateDesc}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <button disabled={isSuspend || loading} className={classes.formButton} onClick={handleCampaignCreate}>
          {
            loading ? <CircularProgress size={25} />: "Create New"
          }
        </button>
      </div>
    </DefaultLayout>
  )
}

export default withRouter(CreateCampaign);
