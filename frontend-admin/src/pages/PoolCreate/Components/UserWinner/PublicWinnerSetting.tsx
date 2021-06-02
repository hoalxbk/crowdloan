import React, {useEffect, useState} from 'react';
import {Collapse, Switch} from "antd";
import Grid from "@material-ui/core/Grid";
import {useCommonStyle} from "../../../../styles";
import useStylesTable from "./style_table";
import {withRouter} from "react-router";
import {Controller} from "react-hook-form";
import {useDispatch} from "react-redux";
import {renderErrorCreatePool} from "../../../../utils/validate";
import FormControl from "@material-ui/core/FormControl";
import useStyles from "../../style";
import {changePublicWinnerStatus} from "../../../../request/pool";
import {alertSuccess} from "../../../../store/actions/alert";

const { Panel } = Collapse;

function callback(key: any) {
  console.log(key);
}

function PublicWinnerSetting(props: any) {
  const commonStyle = useCommonStyle();
  const classes = useStyles();
  const dispatch = useDispatch();
  const renderError = renderErrorCreatePool;
  const [confirmLoading, setConfirmLoading] = useState(false);

  const {
    setValue, errors, control,
    poolDetail,
  } = props;

  useEffect(() => {
    if (poolDetail) {
      console.log('poolDetail.public_winner_status: ', poolDetail.public_winner_status);
      setValue('public_winner_status', !!poolDetail.public_winner_status);
    }
  }, [poolDetail]);

  const changeDisplay = async (value: any) => {

    console.log('Change Status');

    const res = await changePublicWinnerStatus({
      pool_id: poolDetail.id,
      public_winner_status: value,
    });
    console.log('Change Public Winner: Response: ', res);
    if (res.status === 200) {
      dispatch(alertSuccess('Change Public Winner Setting successful!'));
    }
    return value;
  };

  return (
    <>
      <div className={commonStyle.boxSearch} style={{ marginBottom: 25 }}>
        <Collapse onChange={callback} defaultActiveKey={['1']}>
          <Panel header="Public Winner Settings" key="1">
            <Grid container spacing={3}>
              <Grid item xs={8}>

                <>
                  <div><label className={classes.formControlLabel}>Public Winner</label></div>
                  <FormControl component="fieldset">
                    <Controller
                      control={control}
                      name="public_winner_status"
                      render={(field) => {
                        const { value, onChange } = field;
                        return (
                          <Switch
                            onChange={ async (switchValue) => {
                              // eslint-disable-next-line no-restricted-globals
                              if (!confirm('Do you want change this setting ?')) {
                                return false;
                              }
                              await onChange(switchValue);
                              await changeDisplay(switchValue);
                            }}
                            checked={value}
                            checkedChildren="Public"
                            unCheckedChildren="Hidden"
                          />
                        )
                      }}
                    />

                    <p className={classes.formErrorMessage}>
                      {
                        renderError(errors, 'public_winner_status')
                      }
                    </p>
                  </FormControl>
                  <br/>
                </>



              </Grid>
            </Grid>
          </Panel>
        </Collapse>


      </div>
    </>
  );
}
export default withRouter(PublicWinnerSetting);
