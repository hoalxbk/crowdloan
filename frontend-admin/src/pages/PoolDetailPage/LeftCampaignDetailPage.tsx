import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Tooltip, TextField, DialogContentText } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import EditIcon from '@material-ui/icons/Edit';
import Skeleton from '@material-ui/lab/Skeleton';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'
//@ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
//@ts-ignore
import { NotificationManager } from 'react-notifications';
//@ts-ignore
import DateTimePicker from 'react-datetime-picker';
import BigNumber from 'bignumber.js';

import GenerateYourLink from './GenerateYourLink';
import CampaignProgress from '../../components/Base/CampaignProgress';
import ExchangeRate from '../../components/Base/ExchangeRate';
import ConfirmDialog from '../../components/Base/ConfirmDialog';

import { registerICOCampaign, getCampaignDetail, toggleCampaignStatus, editCampaignWithProp, refundTokensForIcoOwner } from '../../store/actions/campaign';

import { isValidAddress } from '../../services/web3';
import { convertUnixTimeToDateTime } from '../../utils/convertDate';
import { isNotValidASCIINumber, isPreventASCIICharacters, trimLeadingZerosWithDecimal } from '../../utils/formatNumber';

import { useTypedSelector } from '../../hooks/useTypedSelector';

import useStyles from './styles';
import useCommonStyle from '../../styles/CommonStyle';
import {publicRoute} from "../../utils";
import {checkIsBetweenCloseTimeAndReleaseTime, checkIsFinishTime, getTokenRemainingCanBuy} from "../../utils/campaign";

interface MatchParams {
  id: string;
}

const CampaignDetailPage: React.FC<RouteComponentProps<MatchParams>> = (props: RouteComponentProps<MatchParams>) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();

  const { failure, data: matchedCampaign } = useTypedSelector(state => state.campaignDetail);
  const { loading: registerLoading } = useTypedSelector(state => state.campaignICORegister);
  const { loading: editCampaignLoading } = useTypedSelector(state  => state.campaignEdit);
  const { loading: campaignStatusToggleLoading } = useTypedSelector(state => state.campaignStatusToggle);
  const { loading: campaignRefundTokensLoading } = useTypedSelector(state => state.campaignRefundTokens);

  const [websiteICOInput, setWebsiteICOInput] = useState("");
  const [registerCampaign, setRegisterCampaign] = useState(false);
  const [openAffiliateEdit, setOpenAffiliateEdit] = useState(false);

  const [openRateEdit, setOpenRateEdit] = useState(false);
  const [rateTypeMenu, setRateTypeMenu] = useState("ETH");

  const [openTimeEdit, setOpenTimeEdit] = useState(false);
  const [editTime, setEditTime] = useState<Date | null>(null);
  const [timeTypeMenu, setTimeTypeMenu] = useState("start time");
  const [openRefundTokens, setOpenRefundTokens] = useState(false);

  const { register, errors, clearErrors, reset, setValue, handleSubmit } = useForm({
    mode: "onChange",
    shouldUnregister: false
  });

  const { history, match } = props;
  const id = match.params.id;

  useEffect(() => {
    dispatch(getCampaignDetail(id));
  }, [id]);

  useEffect(() => {
    if (matchedCampaign) {
      setValue('tokenConversionRate', matchedCampaign.ethRate)
      setRateTypeMenu('ETH');
    };
  }, [matchedCampaign]);

  useEffect(() => {
    if (openTimeEdit) {
      setEditTime(new Date(matchedCampaign.startTime * 1000));
      setValue('editTime', new Date(matchedCampaign.startTime * 1000), {
       shouldValidate: true,
      });
    }
  }, [openTimeEdit]);

  const renderErrorMinMax = (errors: any, prop: string, min: number, max: number = 100) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return 'This field is required'
      } else if (errors[prop].type === "min") {
        return `This field must be greater than ${min}`
      } else if (errors[prop].type === "max") {
        return `This field must be less than ${max}`;
      } else if (errors[prop].type === 'maxDecimals') {
        return `Decimals can not greater than 8`;
      }
    }
  }

  const renderError = (errors: any, prop: string) => {
    if (errors[prop]) {
      const errorType = errors[prop].type;

      switch (errorType) {
        case 'required': {
          return 'This field is required';
        }

        case 'greaterOrEqualToday': {
          return `The ${timeTypeMenu} must be after current date.`;
        }

        case 'greateOrEqualStartTime': {
          return 'This finish time must be after the start time';
        }

        case 'validAddress': {
          return "Address receive is invalid.";
        }

        case 'validDate': {
          return errors[prop].message;
        }

      };
    }

    return;
  };

  const handleICOCampaignRegister = () => {
    dispatch(registerICOCampaign(websiteICOInput, history));
    setRegisterCampaign(false);
  }

  const handleRegisterCampaignOpen = () => {
    setRegisterCampaign(true);
  }

  const handleAffiliateEdit = () => {
    handleSubmit(handleAffiliateFormSubmit)();
  }

  const handleAffiliateEditClose = () => {
    setOpenAffiliateEdit(false);
    clearErrors();
  }

  const handleRateEdit = () => {
    handleSubmit(handleConversionRateSubmit)();
  }

  const handleRateEditClose = () => {
    setOpenRateEdit(false);
    clearErrors();
  }

  const handleTimeDurationEdit = () => {
    handleSubmit(handleTimeDurationSubmit, errors => console.log(errors))();
  }

  const handleTimeDurationClose = () => {
    setOpenTimeEdit(false);
    clearErrors();
  }

  const handleRefundTokensClose = () => {
    reset({
      receiverAddress: '',
      withDrawAmount: ''
    });
    setOpenRefundTokens(false);
    clearErrors();
  }

  const handleRefundTokensOpen = () => {
    setOpenRefundTokens(true);
  }

  const handleRefundTokens = () => {
    handleSubmit(handleRefundTokensSubmit)();
  }

  const handleTimeTypeMenuChoose = (event: React.ChangeEvent<{ value: unknown }>) => {
    const chooseMenu = event.target.value as string;

    let matchedCampaignProp = '';

    switch (chooseMenu) {
      case 'start time': {
        matchedCampaignProp = 'startTime';
        break;
      }

      case 'finish time': {
        matchedCampaignProp = 'closeTime';
        break;
      }

      case 'release time': {
        matchedCampaignProp = 'releaseTime';
        break;
      }
    }

    setEditTime(new Date(matchedCampaign[matchedCampaignProp] * 1000));
    setValue('editTime', new Date(matchedCampaign[matchedCampaignProp] * 1000));

    clearErrors('editTime');
    setTimeTypeMenu(event.target.value as string);
  }


  const handleDatePicking = (datePicker: string, selectedDate: Date | Date[]) => {
    if (selectedDate) {
      clearErrors(datePicker);
    };

    setValue(datePicker, selectedDate);
  };

  const handleTimeDurationSubmit = async (data: any) => {
    const { editTime } = data;
    setTimeTypeMenu('start time');
    dispatch(editCampaignWithProp(timeTypeMenu, editTime, handleTimeDurationClose));
  }

  const handleAffiliateFormSubmit = async (data: any) => {
    const { affiliate } = data;
    dispatch(editCampaignWithProp('affiliate', affiliate, handleAffiliateEditClose));
  }

  const handleRateTypeMenuChoose = (event: React.ChangeEvent<{ value: unknown }>) => {
    const chooseMenu = event.target.value;

    if (chooseMenu === 'USDT') {
      setValue('tokenConversionRate', matchedCampaign.erc20ConversionRate || 0);
    } else if (chooseMenu === 'ETH') {
      setValue('tokenConversionRate', matchedCampaign.ethRate);
    }

    clearErrors();
    setRateTypeMenu(event.target.value as string);
  }

  const handleConversionRateSubmit = async (data: any) => {
    const { tokenConversionRate } = data;
    dispatch(editCampaignWithProp(rateTypeMenu, tokenConversionRate, handleRateEditClose));
  }

  const handleCampaignStatusToggle = () => {
    dispatch(toggleCampaignStatus());
  }

  const handleRefundTokensSubmit = (data: any) => {
    const { receiverAddress, withDrawAmount } = data;
    reset({
      receiverAddress: '',
      withDrawAmount: ''
    });
    dispatch(refundTokensForIcoOwner(receiverAddress, withDrawAmount));
    setOpenRefundTokens(false);
  }

  const checkMaxRefundDecimals = (amount: any) => {
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

  const isFinishTime = checkIsFinishTime(matchedCampaign);
  console.log('isFinishTime', isFinishTime);

  const showCampaignDetail = () => {
    if (matchedCampaign) {
      let { tokenSymbol, isSuspend, isCampaignOwner, refundable, isOwnerReferral, totalTokens, tokenLeft, tokenSold, ethRaised, tokenClaimed } = matchedCampaign;

      return (
        <>
            <div className={styles.groupShow}>
              <div className={`${styles.nameGroupShow} ${styles.nameGroupShowFlex}`}>
                <span>Campaign name</span>
                {
                  isCampaignOwner && <button disabled={campaignStatusToggleLoading} className={`${styles.registerButton} ${isSuspend ? 'active': 'suspend'}`} onClick={handleCampaignStatusToggle}>
                    {
                       isSuspend ? 'Active': 'Suspend'
                    }
                    {
                      !campaignStatusToggleLoading ? !isSuspend ? <PowerSettingsNewIcon className={styles.registerButtonIcon}/>: <CheckCircleIcon className={styles.registerButtonIcon}/> : <CircularProgress size={20} style={{ marginLeft: 10, color: 'white' }} />
                    }
                  </button>
              }
              </div>
              <Tooltip title={<p style={{ fontSize: 15 }}>{matchedCampaign.title}</p>}>
                <span className={`${styles.valueGroupShow} ${styles.wordBreak}`} style={{ width: '100%' }}>
                  {matchedCampaign.title}
                </span>
              </Tooltip>
            </div>
            <div className="clearfix"></div>
            <div className={styles.groupShow}>
              <CampaignProgress campaign={{
                tokenSold,
                tokenLeft,
                totalTokens,
                tokenSymbol,
                tokenClaimed,
                ethRaised
              }} />
            </div>
            <div className="clearfix"></div>
            <div className={styles.groupShow}>
              <label className={styles.nameGroupShow}>Token address</label>
              <div className={`${styles.valueGroupShow} ${styles.valueGroupShowCopy}`}>
                {matchedCampaign.tokenAddress}
                <Tooltip title={<p className={styles.valueGroupShowTooltip}>Copy to clipboard</p> }>
                  <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={matchedCampaign.tokenAddress || ""}>
                    <Button className={styles.valueGroupShowCopyIcon}><img src="/images/icon-copy.svg" alt="" /></Button>
                  </CopyToClipboard>
                </Tooltip>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className={styles.groupShow}>
              <div className={styles.tokenInfo}>
                <div className="tokenInfoBlock">
                  <span className="tokenInfoLabel">Token</span>
                  <div className="tokenInfoContent">
                    <img src="/images/eth.svg" alt="erc20" />
                    <Tooltip title={<p style={{ fontSize: 15 }}>{matchedCampaign.tokenName}</p>}>
                      <p className="tokenInfoText wordBreak">{`${matchedCampaign.tokenName}`}</p>
                    </Tooltip>
                  </div>
                </div>
                <div className="tokenInfoBlock">
                  <span className="tokenInfoLabel">Token Symbol</span>
                  <Tooltip title={<p style={{ fontSize: 15 }}>{matchedCampaign.tokenSymbol}</p>}>
                    <div className="tokenInfoContent wordBreak">
                      {matchedCampaign.tokenSymbol}
                    </div>
                  </Tooltip>
                </div>
                <div className="tokenInfoBlock">
                  <span className="tokenInfoLabel">Token Decimals</span>
                  <div className="tokenInfoContent wordBreak">
                    {matchedCampaign.tokenDecimals}
                  </div>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className={styles.groupShowTime}>
              <label className={styles.nameGroupShow}>Start time</label>
              <div className={styles.valueGroupShow}>{convertUnixTimeToDateTime(matchedCampaign.startTime)}</div>
            </div>
            <div className={styles.lineTime}></div>
            <div className={styles.groupShowTime}>
              <label className={styles.nameGroupShow}>Finish time</label>
              <div className={styles.valueGroupShow}>{convertUnixTimeToDateTime(matchedCampaign.closeTime)}</div>
            </div>
            <div className={styles.lineTime}></div>
            <div className={styles.groupShowTime}>
              <label className={styles.nameGroupShow}>Release time</label>
              <div className={styles.valueGroupShow}>{convertUnixTimeToDateTime(matchedCampaign.releaseTime)}</div>
            </div>
            {
              !isFinishTime && matchedCampaign.isCampaignOwner && (
                <Tooltip title={<p style={{ fontSize: 15 }}>Edit Start And Finish Time</p>} >
                  <EditIcon
                    className={styles.valueGroupShowFlexIcon}
                    style={{ float: 'right' }}
                    onClick={() => {
                      setOpenTimeEdit(true);
                    }}
                  />
                </Tooltip>
              )
            }
            <div className="clearfix"></div>
            <div className={styles.groupShow}>
              <label className={styles.nameGroupShow}>Address (Receive money)</label>
              <div className={`${styles.valueGroupShow} ${styles.valueGroupShowCopy}`}>
                {matchedCampaign.fundingWallet}
                <Tooltip title={<p className={styles.valueGroupShowTooltip}>Copy to clipboard</p> }>
                  <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={matchedCampaign.fundingWallet || ""}>
                    <Button className={styles.valueGroupShowCopyIcon}><img src="/images/icon-copy.svg" alt="" /></Button>
                  </CopyToClipboard>
                </Tooltip>
              </div>
            </div>
            <div className="clearfix"></div>
            {/*<div className={styles.groupShow}>*/}
            {/*  <label className={`${styles.nameGroupShow} ${styles.nameGroupShowFlex}`}>*/}
            {/*    <span>Affiliate</span>*/}
            {/*    {*/}
            {/*      matchedCampaign.isCampaignOwner && (*/}
            {/*        <Tooltip title={<p style={{ fontSize: 15 }}>Edit Affiliate</p>} >*/}
            {/*          <EditIcon className={styles.valueGroupShowFlexIcon} onClick={() =>  setOpenAffiliateEdit(true)} />*/}
            {/*        </Tooltip>*/}
            {/*      )*/}
            {/*    }*/}
            {/*  </label>*/}
            {/*  <div className={`${styles.valueGroupShow} ${styles.valueGroupShowFlex}`}>*/}
            {/*    {*/}
            {/*      matchedCampaign.affiliate*/}
            {/*        ?*/}
            {/*          <div className={styles.affiliateYes}><i className="icon"></i>Yes</div>*/}
            {/*          :*/}
            {/*          <div className={Number(matchedCampaign.ethLink) === 0 ? styles.affiliateNo: styles.affiliateNotRegister}>*/}
            {/*            <i className="icon"></i>*/}
            {/*            <span>{Number(matchedCampaign.ethLink) !== 0 ? 'Yes': 'No'}</span>*/}
            {/*            {*/}
            {/*              matchedCampaign.isCampaignOwner && Number(matchedCampaign.ethLink) !== 0 && isOwnerReferral && <button disabled={registerLoading} className={`${styles.registerButton} ${styles.registerButtonWithLeft}`} onClick={handleRegisterCampaignOpen}>*/}
            {/*                Register now*/}
            {/*                {*/}
            {/*                  registerLoading ? <CircularProgress style={{ marginLeft: 10 }} size={20} /> : <LabelImportantIcon fontSize={"small"} className={styles.registerButtonIcon} />*/}
            {/*                }*/}
            {/*              </button>*/}
            {/*            }*/}
            {/*        </div>*/}
            {/*    }*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className="clearfix"></div>*/}
            <div className={styles.groupShow}>
              <label className={`${styles.nameGroupShow} ${styles.nameGroupShowFlex}`} style={{ display: 'flex', alignItems: 'center' }}>
                <span>Exchange Rates</span>
                {
                  !isFinishTime && matchedCampaign.isCampaignOwner && (
                    <Tooltip title={<p style={{ fontSize: 15 }}>Edit Conversion Rate</p>} >
                      <EditIcon className={styles.valueGroupShowFlexIcon} onClick={() =>  setOpenRateEdit(true)} />
                    </Tooltip>
                  )
                }
              </label>
              <ExchangeRate from="ETH" to={matchedCampaign.tokenSymbol} rate={matchedCampaign.ethRate} />
              {
                Number(matchedCampaign.erc20ConversionRate) !== 0 && (
                  <ExchangeRate from="USDT" to={matchedCampaign.tokenSymbol} rate={matchedCampaign.erc20ConversionRate} />
                )
              }
            </div>
              <div className={`${styles.groupShow} ${styles.groupShowSpacing}`}>
              <p className={styles.groupShowLabelCenter}>Please deposit token to campaign smart contract address for ICO.</p>
              <div className={`${styles.valueGroupShow} ${styles.valueGroupShowCopy} ${styles.valueGroupTransaction}`}>
                {matchedCampaign.transactionHash}
                <Tooltip  title={<p className={styles.valueGroupShowTooltip}>Copy to clipboard</p> }>
                  <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={matchedCampaign.transactionHash || ""}>
                    <Button className={styles.valueGroupShowCopyIcon}><img src="/images/icon-copy.svg" alt="" /></Button>
                  </CopyToClipboard>
                </Tooltip>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className={`${styles.groupShow}`}>
              {
               !refundable ? <Button component={Link} disabled={isSuspend} to={publicRoute(`/buy-token?campaignId=${matchedCampaign.transactionHash}`)} className={`${styles.registerButton} ${styles.buyButton}`}>
                  <span className={styles.buttonText}>
                  Buy Now
                  </span>
                  <div className={styles.buttonIcon}>
                    <img src="/images/icon-right-arrow.svg" alt="icon-right" className={styles.buttonIcon} />
                  </div>
               </Button>: (
                <Button disabled={campaignRefundTokensLoading || checkIsBetweenCloseTimeAndReleaseTime(matchedCampaign)} className={`${styles.registerButton} ${styles.buyButton}`} onClick={handleRefundTokensOpen}>
                  <span className={styles.buttonText}>
                    Refund Tokens
                  </span>
                  {
                    !campaignRefundTokensLoading ? (
                      <div className={styles.buttonIcon}>
                        <img src="/images/icon-right-arrow.svg" alt="icon-right" className={styles.buttonIcon} />
                      </div>): (
                      <CircularProgress size={25} />
                    )
                  }
               </Button>
               )
              }
            </div>
            <div className="clearfix"></div>
        </>
        )
    } else if (failure) {
      return <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>There is no campaign that does exists</p>;
    }

    return (
      <div className={styles.skeletonLoading}>
        {
          [...Array(10)].map((num, index) => (
          <div key={index}>
            <Skeleton className={styles.skeleton} width="100%" />
          </div>
          ))
        }
      </div>
    );
  }

  return (
      <div className={styles.boxCampaignDetail}>
        <div className={styles.headBoxCampaignDetail}>
          <span className={`${styles.campaignDetailStatus} campaign-${matchedCampaign && matchedCampaign.isSuspend ? 'suspend': 'active'}`}>
            {
              matchedCampaign && (new Date(convertUnixTimeToDateTime(matchedCampaign.releaseTime)) <= new Date() ? 'Claim': matchedCampaign.isSuspend ? 'Suspend': 'Active')
            }
          </span>
          <h2 className={styles.titleBoxCampaignDetail}>Campaign Detail</h2>
        </div>
        <div className="clearfix"></div>
        <div className={styles.formShow}>
          {showCampaignDetail()}
        </div>
        <GenerateYourLink />
        <ConfirmDialog
          title={"Register Affiliate"}
          open={registerCampaign}
          confirmLoading={registerLoading}
          onConfirm={handleICOCampaignRegister}
          onCancel={() => { setRegisterCampaign(false); clearErrors() }}
        >
          <TextField
            margin="dense"
            id="name"
            label="Website address"
            type="email"
            fullWidth
            onChange={(e: any) => setWebsiteICOInput(e.target.value)}
          />
        </ConfirmDialog>
        <ConfirmDialog
          title={"Edit ERC20 Conversion Rate"}
          open={openRateEdit}
          confirmLoading={editCampaignLoading}
          onConfirm={handleRateEdit}
          onCancel={() => { setOpenRateEdit(false); clearErrors() }}
          btnLoading={true}
        >
          <label className={`${styles.formControlLabel} ${styles.formControlBlurLabel}`}>ERC20 Type: </label>
         <select
            className={styles.formControlInput}
            onChange={handleRateTypeMenuChoose}
          >
             <option value="ETH">ETH</option>
             <option value="USDT">USDT</option>
          </select>
          <div className={`${styles.groupShowRate} ${styles.formControlFlex}`}>
            <div className={styles.formControlFlexBlock}>
              <label className={`${styles.formControlLabel} ${styles.formControlBlurLabel}`}>You have</label>
              <div className={styles.formControlRate}>
                <input
                  type="number"
                  name="ethFor"
                  disabled={true}
                  value={1}
                  className={`${styles.formInputBox} ${styles.formInputBoxEther}`}
                />
                <button className={styles.box}>{rateTypeMenu}</button>
              </div>
            </div>
            <img className={styles.formControlIcon} src="/images/icon-exchange.svg" alt="" />
            <div className={styles.formControlFlexBlock}>
              <label className={`${styles.formControlLabel} ${styles.formControlBlurLabel}`}>You get*</label>
              <div className={styles.formControlRate}>
                <input
                  type="text"
                  name="tokenConversionRate"
                  className={`${styles.formInputBox} ${styles.formInputBoxBS}`}
                  ref={register({
                    required: true,
                    validate: {
                      min: value => value > 0,
                      maxDecimals: checkMaxRefundDecimals,
                    },
                  })}
                  onKeyDown={(e: any) => isNotValidASCIINumber(e.keyCode, true) && e.preventDefault()}
                  onKeyPress={(e: any) => isPreventASCIICharacters(e.key) && e.preventDefault()}
                  onBlur={(e: any) => setValue('tokenConversionRate', trimLeadingZerosWithDecimal(e.target.value))}
                  onPaste={(e: any) => {
                    const pastedText = e.clipboardData.getData("text");

                    if (isNaN(Number(pastedText))) {
                      e.preventDefault();
                    }
                  }}
                  defaultValue={matchedCampaign && matchedCampaign.ethRate}
                  maxLength={255}
                />
                <span className={styles.errorMessageAbsolute}>
                {
                  renderErrorMinMax(errors, "tokenConversionRate", 0, 100)
                }
                </span>
                <Tooltip title={<p style={{ fontSize: 15 }}>{matchedCampaign && matchedCampaign.tokenSymbol}</p>}>
                  <button className={`${styles.box} ${styles.boxEther}` }>{matchedCampaign && matchedCampaign.tokenSymbol}</button>
                </Tooltip>
              </div>
            </div>
          </div>
        </ConfirmDialog>
        <ConfirmDialog
          title={"Edit Affiliate With ETHLink"}
          open={openAffiliateEdit}
          confirmLoading={editCampaignLoading}
          onConfirm={handleAffiliateEdit}
          onCancel={() => { setOpenAffiliateEdit(false); clearErrors() }}
          btnLoading={true}
        >
            <select
              className={styles.formControlInput}
              name="affiliate"
              ref={register({
                required: true
              })}
              defaultValue={matchedCampaign && Number(matchedCampaign.ethLink) !== 0 ? 'yes': 'no'}
            >
              <option value="">Select a value</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className={styles.errorMessage}>
              {
                renderError(errors, 'affiliate')
              }
            </p>
        </ConfirmDialog>
        <ConfirmDialog
          title={"Edit Time Duration"}
          open={openTimeEdit}
          confirmLoading={editCampaignLoading}
          onConfirm={handleTimeDurationEdit}
          onCancel={() => { setOpenTimeEdit(false); clearErrors() }}
          btnLoading={true}
        >
         <select
            className={styles.formControlInput}
            onChange={handleTimeTypeMenuChoose}
          >
             <option value="start time">Start time</option>
             <option value="finish time">Finish time</option>
             <option value="release time">Release time</option>
          </select>
          <DateTimePicker
            className={`${commonStyle.DateTimePicker} ${styles.formDatePicker} ${styles.datePicker}`}
            monthPlaceholder="mm"
            dayPlaceholder="dd"
            yearPlaceholder="yy"
            calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
            value={editTime}
            onChange={(date: any) => { handleDatePicking("editTime", date); setEditTime(date) }}
          />
          <input
            type="hidden"
            name="editTime"
            ref={register({
              required: true,
              validate: {
                greaterOrEqualToday: value => new Date(value) >= new Date(),
                validDate: (value: string) => {
                  if (timeTypeMenu === 'start time') {
                    if (new Date(value) > new Date(matchedCampaign.closeTime * 1000)) {
                      return 'The start time must before finish time.';
                    } else if (new Date(value) >= new Date(matchedCampaign.releaseTime * 1000)) {
                      return 'The start time must before release time.';
                    }
                  } else if (timeTypeMenu === 'finish time') {
                    if (new Date(value) < new Date(matchedCampaign.startTime * 1000)) {
                      return 'The finish time must after start time.';
                    } else if (new Date(value) >= new Date(matchedCampaign.releaseTime * 1000)) {
                      return 'The finish time must before release time.';
                    }
                  } else if (timeTypeMenu === 'release time') {
                    if (new Date(value) < new Date(matchedCampaign.closeTime * 1000)) {
                      return 'The release time must after finish time.';
                    } else if (new Date(value) < new Date(matchedCampaign.startTime * 1000)) {
                      return 'The release time must after start time.';
                    }
                  }

                  return true;
                }
              }
            })}
          />
          <p className={`${styles.errorMessage}`}>
            {
              renderError(errors, 'editTime')
            }
          </p>
        </ConfirmDialog>
        <ConfirmDialog
          title={"Refund Tokens"}
          open={openRefundTokens}
          confirmLoading={campaignRefundTokensLoading}
          onConfirm={handleRefundTokens}
          onCancel={handleRefundTokensClose}
        >
           <DialogContentText>
                      To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="receiverAddress"
            label="Address (Receive money)"
            inputProps={{
              maxLength: 255,
              name: "receiverAddress",
            }}
            inputRef={register({
              required: true,
              validate: {
                validAddress: val => isValidAddress(val)
              }
            })}
            fullWidth
          />
          <span className={styles.errorMessage}>
            {
              renderError(errors, "receiverAddress")
            }
          </span>
          {/*<TextField*/}
          {/*  margin="dense"*/}
          {/*  id="withDrawAmount"*/}
          {/*  label="Amount"*/}
          {/*  type="number"*/}
          {/*  inputProps={{*/}
          {/*    min: 0,*/}
          {/*    // max: matchedCampaign && matchedCampaign.tokenLeft,*/}
          {/*    max: matchedCampaign && getTokenRemainingCanBuy(matchedCampaign),*/}
          {/*    type: 'text',*/}
          {/*    className: `${styles.inputNumeric}`,*/}
          {/*    name: "withDrawAmount"*/}
          {/*  }}*/}
          {/*  inputRef={register({*/}
          {/*    required: true,*/}
          {/*    // max: matchedCampaign && matchedCampaign.tokenLeft,*/}
          {/*    max: matchedCampaign && getTokenRemainingCanBuy(matchedCampaign),*/}
          {/*    validate: {*/}
          {/*      maxDecimals: checkMaxRefundDecimals,*/}
          {/*      min: value => value > 0,*/}
          {/*      max: value => {*/}
          {/*        // const tokenLeft = matchedCampaign && new BigNumber(matchedCampaign.tokenLeft);*/}
          {/*        const tokenLeft = getTokenRemainingCanBuy(matchedCampaign);*/}
          {/*        if (tokenLeft) {*/}
          {/*          return new BigNumber(tokenLeft).gte(value);*/}
          {/*        }*/}
          {/*        return;*/}
          {/*      }*/}
          {/*    }*/}
          {/*  })}*/}
          {/*  onKeyDown={(e: any) => isNotValidASCIINumber(e.keyCode, true) && e.preventDefault()}*/}
          {/*  onKeyPress={(e: any) => isPreventASCIICharacters(e.key) && e.preventDefault()}*/}
          {/*  onBlur={(e: any) => setValue('withDrawAmount', trimLeadingZerosWithDecimal(e.target.value))}*/}
          {/*  onPaste={(e: any) => {*/}
          {/*    const pastedText = e.clipboardData.getData("text");*/}

          {/*    if (isNaN(Number(pastedText))) {*/}
          {/*      e.preventDefault();*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  fullWidth*/}
          {/*/>*/}
          {/*<span className={styles.errorMessage}>*/}
          {/*  {*/}
          {/*    renderErrorMinMax(errors, "withDrawAmount", 0, new BigNumber(getTokenRemainingCanBuy(matchedCampaign)).toNumber())*/}
          {/*  }*/}
          {/*</span>*/}
        </ConfirmDialog>
      </div>
  );
};

export default withRouter(CampaignDetailPage);
