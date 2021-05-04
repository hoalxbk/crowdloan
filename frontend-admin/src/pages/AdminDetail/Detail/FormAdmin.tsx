import React from 'react';
import {useForm} from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import {Button} from '@material-ui/core';
import useStyles from '../styles';
import {useCommonStyle} from '../../../styles';
import {createAdmin, updateAdmin} from "../../../request/admin";
import {alertFailure, alertSuccess} from "../../../store/actions/alert";
import {useDispatch} from "react-redux";
import {adminRoute} from "../../../utils";

const FormAdmin = (props: any) => {
  const styles = useStyles();
  const commonStyle = useCommonStyle();
  const dispatch = useDispatch();

  const { history, isCreate } = props;
  let { id, username, email, firstname, lastname, wallet_address, is_active } = props.admin;
  const { register, errors, handleSubmit, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      username,
      email,
      firstname,
      lastname,
      wallet_address,
      password: '',
      is_active
    },
  });

  const onSubmit = (values: any) => {
    console.log(values);
    if (isCreate) {
      createAdmin(values)
        .then((res) => {
          if (res.status == 200) {
            dispatch(alertSuccess('Create success'));
            history.push(adminRoute('/admins'));
          } else {
            dispatch(alertFailure(res.message || 'Something went wrong'));
          }
        });
    } else {
      updateAdmin(id, values)
        .then((res) => {
          if (res.status == 200) {
            dispatch(alertSuccess('Update success'));
            history.push(adminRoute('/admins'));
          } else {
            dispatch(alertFailure(res.message || 'Something went wrong'));
          }
        });
    }
  };

  console.log('Error: ', errors);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Username  <span className={commonStyle.required}>*</span>
          </label>
          <input
            className={styles.inputG}
            name="username"
            placeholder=""
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.username && <span className={commonStyle.error}>This field is required</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Password
            {isCreate && <span className={commonStyle.required}>*</span>}
          </label>
          <input
            className={styles.inputG}
            name="password"
            placeholder=""
            ref={
              register(
              isCreate ?
                { required: true, maxLength: 255 } :
                { maxLength: 255 }
              )
            }
          />
          {errors.password && <span className={commonStyle.error}>This field is required</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Email
            <span className={commonStyle.required}>*</span>
          </label>
          <input
            className={styles.inputG}
            name="email"
            placeholder="Email"
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.email && <span className={commonStyle.error}>This field is required</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>
            Wallet address
            <span className={commonStyle.required}>*</span>
          </label>
          <input
            className={styles.inputG}
            name="wallet_address"
            placeholder=""
            ref={register({ required: true, maxLength: 255 })}
          />
          {errors.wallet_address && <span className={commonStyle.error}>This field is required</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>First Name</label>
          <input
            className={styles.inputG}
            name="firstname"
            placeholder=""
            ref={register({ maxLength: 255 })}
          />
          {errors.firstname && <span className={commonStyle.error}>Max length is 255</span>}
        </div>
        <div className="clearfix"></div>


        <div className={styles.groupInput}>
          <label className={styles.inputLabel}>Last Name</label>
          <input
            className={styles.inputG}
            name="lastname"
            placeholder=""
            ref={register({ maxLength: 255 })}
          />
          {errors.lastname && <span className={commonStyle.error}>Max length is 255</span>}
        </div>
        <div className="clearfix"></div>

        <div className={styles.listBtn}>
          <Button
            type="submit"
            className={styles.btnSubmit}>
              Submit
          </Button>
          {/*<Button*/}
          {/*  className={styles.btnCancel}*/}
          {/*  onClick={() => props.setEditCampaignDetail(false)}*/}
          {/*>*/}
          {/*    Cancel*/}
          {/*</Button>*/}
        </div>

      </form>
    </>
  );
};

export default withRouter(FormAdmin);
