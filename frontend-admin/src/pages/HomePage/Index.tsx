import React, {useEffect, useState} from 'react';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from "./style";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Tooltip
} from '@material-ui/core';
import {useForm} from 'react-hook-form'
import {TransitionProps} from '@material-ui/core/transitions';
import {connect, useDispatch, useSelector} from 'react-redux';
import Skeleton from '@material-ui/lab/Skeleton';
import {debounce} from 'lodash';
import CampaignProgress from '../../components/Base/CampaignProgress';
import ExchangeRate from '../../components/Base/ExchangeRate';
import ButtonLink from '../../components/Base/ButtonLink';
import {getCampaignDetail, getLatestCampaign} from '../../store/actions/campaign';
import {addTokenByUser, getTokensByUser} from '../../store/actions/token';
import {convertUnixTimeToDateTime} from '../../utils/convertDate';
import BigNumber from 'bignumber.js';
import {getTokenInfo, TokenType} from '../../utils/token';
import { logout } from '../../store/actions/user';
import {adminRoute} from "../../utils";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const HomePage = (props: any) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state: any) => state.campaignLatest);
  const { loading: tokenCreateLoading } = useSelector((state: any) => state.tokenCreateByUser);
  const { loading: tokensByUserLoading, data: tokens } = useSelector((state: any) => state.tokensByUser);
  const campaignDetailContract = useSelector((state: any) => state.campaignDetail);
  const loginUser = useSelector((state: any) => state.userConnect).data;

  const [openAddToken, setOpenAddToken] = useState(false);
  const [token, setToken] = useState<TokenType | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const { handleSubmit, register, errors, setError } = useForm({
    mode: "onChange"
  });

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
      setError('token', {
        type: "invalidToken",
        message: err.message
      });
    };
  }, 500);


  const renderError = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === 'required') {
        return 'This field is required';
      } else if (errors[prop].type === 'greaterOrEqualToday') {
        return 'This Date must equal or greater than today'
      } else if (errors[prop].type === 'greateOrEqualStartTime') {
        return 'This Date must equal or greater than Start Time'
      } else if (errors[prop].type === 'invalidToken') {
        return errors[prop].message;
      }
    }

    return;
  };

  const handleTokenAdd = () => {
    handleSubmit(handleFormSubmit)();
  }

  const handleFormSubmit = (data:any) => {
    if (token) {
      const { address, symbol } = token;

      dispatch(addTokenByUser({tokenSymbol: symbol, tokenAddress: address, walletAddress: loginUser}));
      setOpenAddToken(false);
      setToken(null);
      setLoadingToken(false);
    }
  }

  useEffect(() => {
    dispatch(getTokensByUser());
    dispatch(getLatestCampaign());
  }, [dispatch, loginUser]);

  const id = (data && data.campaign_hash);

  useEffect(() => {
    dispatch(getCampaignDetail(id));
  }, [id]);

  return (
    <DefaultLayout>
      {
        props.children
      }
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src="/images/dashboard/logo.svg" alt="Logo"/>
          <span style={{ marginLeft: 8 }}>SotatekStarter</span>
        </div>
        <div>
          <button className={styles.logoutBtn} onClick={() => dispatch(logout())}>Log out</button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.bannerLeft}>
            <img src="/images/dashboard/picture-purchase.svg" alt="banner"/>
            <div className={styles.contentPurchase}>
              <h2>Purchase coins</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.</p>
            </div>
          </div>
          <div className={styles.walletDetail}>
            <div className="wallet-detail-title">
              <span>Wallet Details</span>
              <Button disabled={tokenCreateLoading} endIcon={<span className='iconButton'><img src="/images/icon-right-arrow.svg" alt="right-arrow"/></span>}
                className={styles.buttonGoto} onClick={() => setOpenAddToken(true)}>
                  Add Token
              </Button>
            </div>
            {
              tokensByUserLoading ? <div className={styles.loadingIconWrapper}><CircularProgress size={25} /></div>  : tokens &&
                tokens.length > 0 && tokens.map((token: any) => (
                  <div key={token.id} className="wallet-detail-row">
                    <img src={`/images/token/${token.symbol_name === 'ETH'? 'eth': 'erc20'}.svg` } alt="right-arrow"/>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{token.symbol_name}</p>}>
                      <span>{token.symbol_name}</span>
                    </Tooltip>
                    <Tooltip title={<p style={{ fontSize: 15 }}>{new BigNumber(token.balance).toFixed()} {token.symbol_name}</p>}>
                      <span className={styles.walletRowValue}>{new BigNumber(token.balance).toFixed()} {token.symbol_name}</span>
                     </Tooltip>
                  </div>
              ))
            }
            {
              tokenCreateLoading && ( <div className={styles.loadingIconWrapper}><CircularProgress  size={25} /></div> )
            }
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.rightContainerBlock}>
            <div className={styles.createButtonWrap}>
              <ButtonLink to={adminRoute('/campaigns/add')} icon="icon-plus.svg" className={styles.buttonCreateNew} text="Create New Campaign" />
            </div>
            <div className={styles.mainContent}>
              {
                loading ? (
                  <div className={styles.skeletonLoading}>
                    {
                      [...Array(3)].map((num, index) => (
                      <div key={index}>
                        <Skeleton className={styles.skeleton} width="100%" />
                      </div>
                      ))
                    }
                  </div>
                ) : (
                  data && (
                    <>
                      <div className={styles.date}>
                        <img src="/images/icon-clock.svg" alt="right-arrow"/>
                        {convertUnixTimeToDateTime(data.start_time)} - {convertUnixTimeToDateTime(data.finish_time)}
                      </div>
                      <Tooltip title={<p style={{ fontSize: 15 }}>{data.title}</p>}>
                          <div className={styles.chartTitle}>
                          {data.title}
                          </div>
                        </Tooltip>
                      <CampaignProgress campaign={{
                        tokenLeft: data.tokenLeft,
                        tokenSold: data.tokenSold,
                        tokenClaimed: data.tokenClaimed,
                        totalTokens: data.totalTokens,
                        tokenSymbol: data.symbol
                      }} className={styles.campaignProgressSpace} buyNow={data.campaign_hash}/>
                    </>
                  )
                )
              }
              </div>
          </div>
          <div className={styles.rightContainerBlock}>
                <div className={styles.mainContent}>
            {
              loading ? (
                <div className={styles.skeletonLoading}>
                  {
                    [...Array(3)].map((num, index) => (
                    <div key={index}>
                      <Skeleton className={styles.skeleton} width="100%" />
                    </div>
                    ))
                  }
                </div>
              ) : (
                <>
                  <label className={styles.nameGroupShow} style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Exchange Rates</span>
                  </label>
                  <ExchangeRate from="ETH" to={data && data.symbol} rate={data && data.ether_conversion_rate} />
                  {campaignDetailContract && campaignDetailContract.data &&
                    Number(campaignDetailContract.data.erc20ConversionRate) !== 0 &&
                    <ExchangeRate from="USDT" to={campaignDetailContract.data.tokenSymbol} rate={campaignDetailContract.data.erc20ConversionRate} />
                  }
                </>
              )
            }
            </div>
          </div>
        </div>
         <Dialog
          open={openAddToken}
          TransitionComponent={Transition}
          className={styles.dialog}
          >
            <DialogTitle id="alert-dialog-slide-title">Add ERC20 Token</DialogTitle>
            <DialogContent className={styles.dialogContent}>
               <DialogContentText>
                 To subscribe to this website, please enter your email address here. We will send updates occasionally.
              </DialogContentText>
              <div className={styles.formControl}>
              <label className={styles.formControlLabel}>Token address</label>
              <input
                type="text"
                name="token"
                ref={register({
                  validate: {
                    invalidToken: async (val: string) => {
                      try {
                        const tokenInfo = await getTokenInfo(val);

                        if (tokenInfo) return true;
                      } catch (err) { return err.message;
                      }
                    }
                  }
                })}
                maxLength={255}
                onChange={handleTokenGetInfo}
                className={styles.formControlInput}
              />
              {
                loadingToken ? <CircularProgress size={25} /> : (token && <img src="/images/icon_check.svg" className={styles.loadingTokenIcon} />)
              }
              <p className={styles.formErrorMessage}>
                {
                  renderError(errors, 'token')
                }
              </p>
            </div>
            {
              token && (
                <div className={styles.tokenInfo}>
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
                        <span className="wordBreak">{`${token.symbol}`}</span>
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
              </DialogContent>
              <div className={styles.dialogActions}>
                <Button className={styles.dialogButton} onClick={handleTokenAdd} color="primary">
                  Submit
                </Button>
                <Button className={`${styles.dialogButton} ${styles.dialogButtonCancel}`} onClick={() => setOpenAddToken(false)} color="primary">
                  Cancel
                </Button>
              </div>
          </Dialog>
      </div>
    </DefaultLayout>
  );
};

const mapStateToProps = (state:any) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(HomePage);
