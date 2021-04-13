import React, {useEffect, useState} from 'react';
import {getTokenInfo} from "../../../utils/token";
import {CircularProgress, Tooltip} from "@material-ui/core";
import useStyles from "../style";
import {debounce} from "lodash";
import {renderErrorCreatePool} from "../../../utils/validate";

function TokenAddress(props: any) {
  const classes = useStyles();
  const [loadingToken, setLoadingToken] = useState(false);

  const {
    register, setValue, errors,
    poolDetail,
    token, setToken,
  } = props;
  const renderError = renderErrorCreatePool;

  useEffect(() => {
    if (poolDetail && poolDetail.token) {
      setValue('token', poolDetail.token, { shouldValidate: true });
      loadingTokenData(poolDetail.token);
    }
  }, [poolDetail]);

  const loadingTokenData = async (tokenValue: string) => {
    try {
      setToken(null);
      setLoadingToken(true);

      const tokenAddress = tokenValue;
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
  };

  const handleTokenGetInfo = debounce(async (e: any) => {
    await loadingTokenData(e.target.value);
  }, 500);

  return (
    <>
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
    </>
  );
}

export default TokenAddress;
