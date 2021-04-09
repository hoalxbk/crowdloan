import React, { useState, useEffect } from 'react';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux'
import Skeleton from '@material-ui/lab/Skeleton';
import { useForm } from 'react-hook-form'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import LinkIcon from '@material-ui/icons/Link';
//@ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard';
//@ts-ignore
import { NotificationManager } from 'react-notifications';

import { trimLeadingZeros, isNotValidASCIINumber, isPreventASCIICharacters } from '../../utils/formatNumber';
import { createAffiliateCampaign } from '../../store/actions/campaign';
import { generateAffiliateLink, getAffiliateByCampaign } from '../../store/actions/affiliate';
import ConfirmDialog from '../../components/Base/ConfirmDialog';

import useStyles from './styles';

const BASE_URL = process.env.REACT_APP_BASE_URL || "";

const GenerateYourLink: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { data: affiliates, failure, loading: affiliateCampaignLoading } = useSelector((state: any) => state.affiliateCampaign);
  const { loading: campaignCreateLoading } = useSelector((state: any) => state.campaignAffiliateCreate);
  const { loading: affiliateGenerateLoading } = useSelector((state: any) => state.affiliateLinkGenerate);
  const campaignDetail = useSelector((state: any) => state.campaignDetail);
  const { data: campaignDetailData } = campaignDetail;
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const loginUser = useSelector((state: any) => state.user).data;
  const { register, errors, setValue, handleSubmit } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if (campaignDetailData) {
      dispatch(getAffiliateByCampaign());
    }
  }, [campaignDetailData]);

  const handleCampaignCreate = () => {
    handleSubmit(handleFormSubmit)();
  }

  const handleFormSubmit = (data:any) => {
    const { name, commission } = data;
    const { history } = props;

    dispatch(createAffiliateCampaign({
      name,
      commission
    }, history));

    setOpenCreateDialog(false);
  }

  const handleAffiliateLinkGenerated = (campaign_index: any) => {
    dispatch(generateAffiliateLink(campaign_index));
  }

  const renderError = (errors: any, prop: string) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return <span className={styles.errorMessage}>This field is required</span>
      } 
    }

    return null;
  }

  const renderErrorMinMax = (errors: any, prop: string, min: number, max: number) => {
    if (errors[prop]) {
      if (errors[prop].type === "required") {
        return <span className={styles.errorMessage}>This field is required</span>
      } else if (errors[prop].type === "min") {
        return <span className={styles.errorMessage}>This field must be greater than {min}</span>
      } else if (errors[prop].type === "max") {
        return <span className={styles.errorMessage}>This field must be less than {max}</span>
      }
    }

    return null;
  }

  if (campaignDetailData) {
    const { isCampaignOwner, affiliate, transactionHash } = campaignDetailData;

    return (
      <div className={styles.boxGenerateYourLink}>
        {
          isCampaignOwner && affiliate && <Button disabled={campaignCreateLoading} className={styles.btnGenerateYourLink} onClick={() => setOpenCreateDialog(true)}>
            Create campaign
            <img src="/images/icon-plus.svg" alt=""/>
            {
              campaignCreateLoading && <CircularProgress size={20} style={{ marginLeft: 10 }} />
            }
          </Button>
        }
        <div className="clearfix"></div>
        <TableContainer component={Paper} className={styles.tableGenerateYourLink}>
          {
            affiliateCampaignLoading ? (
              [...Array(3)].map((num, index) => (
              <div key={index}>
                <Skeleton className={styles.skeleton} width="100%" />
              </div>
            ))):  (
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.TableCellHead}>Campaign referral name</TableCell>
                <TableCell className={styles.TableCellHead}>Referral rate</TableCell>
                <TableCell className={styles.TableCellHead} align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {affiliates && affiliates.length > 0 && affiliates.map((row: any) => (
                <TableRow key={row.name} className={styles.TableRowBody}>
                  <TableCell className={styles.TableCellBody}>{row.name}</TableCell>
                  <TableCell className={styles.TableCellBody}>{row.commission} %</TableCell>
                  <TableCell className={`${styles.TableCellBody} ${styles.TableCellBodyFlex}`} align="right">
                    {
                      row.linkGenerated &&  (
                        <Tooltip title={<p className={styles.valueGroupShowTooltip}>Copy to clipboard</p> }>
                          <CopyToClipboard onCopy={() => NotificationManager.success("Copied")} text={`${BASE_URL}/#/buy-token?campaignId=${transactionHash}${affiliate ? `&referral=${loginUser.wallet_address}&campaignIndex=${row.campaign_index}`: ''}`}>
                            <Button disabled={!affiliate || affiliateGenerateLoading}><img src="/images/icon-copy.svg" alt="" /></Button>
                          </CopyToClipboard>
                        </Tooltip>
                      )
                    }
                    <Tooltip title={<p className={styles.linkIconTooltip}>Generate affiliate link</p>}>
                      <div>
                        {
                          !row.linkGenerated && <LinkIcon className={styles.linkIcon} onClick={() => affiliate && handleAffiliateLinkGenerated(row.campaign_index)}/>
                        }
                      </div>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {
          affiliateGenerateLoading &&  (
            <div style={{ textAlign: 'center', marginTop: 30 }}>
                <CircularProgress size={25} />
            </div>
          )
        }
        {
          failure ? <p className={styles.errorMessage}>{failure}</p> : ((!affiliates || affiliates.length === 0) && !affiliateCampaignLoading) ? <p className={styles.noDataMessage}>There is no data</p> : (
            <div style={{overflow: 'hidden'}}>
              {/*<Button className={styles.btnViewMore}><i className="icon"></i>View more</Button>*/}
            </div>
          )
        }
          <ConfirmDialog
            open={openCreateDialog}
            title={"Create Campaign Referral"}
            confirmLoading={campaignCreateLoading}
            onConfirm={handleCampaignCreate}
            onCancel={() => setOpenCreateDialog(false)}
          >
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Campaign name"
                inputProps={{
                  maxLength: 255,
                  name: "name"
                }}
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {
                renderError(errors, "name")
              }
              <TextField
                margin="dense"
                id="name"
                label="Campaign commission (%)"
                type="commission"
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'text',
                  className: `${styles.inputNumeric}`,
                  name: "commission",
                  maxLength: 3 
                }}
                inputRef={register({
                  required: true,
                  max: 100,
                  maxLength: 3,
                  validate: {
                    min: value => value > 0
                  }
                })}
                onKeyDown={(e: any) => isNotValidASCIINumber(e.keyCode) && e.preventDefault()}
                onKeyPress={(e: any) => isPreventASCIICharacters(e.key) && e.preventDefault()}  
                onBlur={(e: any) => setValue('commission', trimLeadingZeros(e.target.value))}
                onPaste={(e: any) => { 
                  const pastedText = e.clipboardData.getData("text");

                  if (pastedText.match(/[^\d]+/)) {
                    e.preventDefault();
                  }
                }}
                fullWidth
              />
              {
                renderErrorMinMax(errors, "commission", 0, 100)
              }
          </ConfirmDialog>
        </TableContainer>
        <div className="clearfix"></div> 
      </div>
    )
  }

  return <div></div>;
};

export default withRouter(GenerateYourLink); 
