import React, {useEffect, useState} from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {useForm} from "react-hook-form";
import {renderErrorCreatePool} from "../../../../utils/validate";
import moment from "moment";
import {DATETIME_FORMAT} from "../../../../constants";
import { Checkbox, Divider } from 'antd';
const CheckboxGroup = Checkbox.Group;

function UserParticipantCreatePopup(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, isEdit,
    handleCreateUpdateData,
  } = props;

  const renderError = renderErrorCreatePool;
  const {
    register, setValue, getValues, clearErrors, errors, handleSubmit, control,
    formState: { touched, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData,
    },
  });

  const [users, setUsers] = useState([]);

  // For Checkbox
  const [plainOptions, setPlainOptions] = useState([]);
  const defaultCheckedList: any[] | never[] | (() => any[]) = [];
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const onChange = (list: any[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < users.length);
    setCheckAll(list.length === users.length);
  };
  const onCheckAllChange = (e: any) => {

    const selected = users.map((it: any) => it.value);
    console.log('USSSS+=============>', selected);

    setCheckedList(e.target.checked ? selected : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  // For users
  useEffect(() => {
    if (editData && editData.length > 0) {
      const usersList = editData.map((it: any) => {
        return {
          label: (it.wallet_address + `(${it.email})`),
          value: it.wallet_address,
        }
      });
      setUsers(usersList);

      const lst = editData.map((it: any) => it.wallet_address);
      // (it.wallet_address + `(${it.email})`)
      // const lst = editData.map((it: any) => {
      //   return {
      //     label: (it.wallet_address + `(${it.email})`),
      //     value: it.wallet_address,
      //   }
      // });

      console.log('Init Plain Options: ', lst);
      setPlainOptions(lst);
    }
  }, [editData]);

  const submitData = (data: any) => {
    handleCreateUpdateData && handleCreateUpdateData(checkedList);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)()
      .then((res) => {
        console.log('Res: ', isValid, errors);
        if (isValid) {
          clearErrors();
        }
      });
  };

  console.log('checkedList=====>', checkedList);

  return (
    <>
      <ConfirmDialog
        title={'Add'}
        open={isOpenEditPopup}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => { setIsOpenEditPopup(false); clearErrors() }}
      >



        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Check all
        </Checkbox>
        <Divider />
        <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />

        {/*{users && users.map((item: any) => {*/}
        {/*  return (*/}
        {/*    <>*/}
        {/*      <Checkbox*/}
        {/*        key={item.id}*/}
        {/*      >{item.wallet_address} ({item.email})*/}
        {/*      </Checkbox>*/}
        {/*      <br/>*/}
        {/*    </>*/}
        {/*  );*/}
        {/*})}*/}



        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>Email</label>*/}
        {/*  <input*/}
        {/*    type="email"*/}
        {/*    name="email"*/}
        {/*    ref={register({ required: true })}*/}
        {/*    maxLength={255}*/}
        {/*    className={classes.formControlInput}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<p className={classes.formErrorMessage}>*/}
        {/*  {*/}
        {/*    renderError(errors, 'email')*/}
        {/*  }*/}
        {/*</p>*/}


        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>Wallet address</label>*/}
        {/*  <input*/}
        {/*    name="wallet_address"*/}
        {/*    ref={register({ required: true })}*/}
        {/*    maxLength={255}*/}
        {/*    className={classes.formControlInput}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<p className={classes.formErrorMessage}>*/}
        {/*  {*/}
        {/*    renderError(errors, 'wallet_address')*/}
        {/*  }*/}
        {/*</p>*/}
















        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>Name</label>*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    value={editData.name}*/}
        {/*    className={classes.formControlInput}*/}
        {/*    disabled={true}*/}
        {/*  />*/}
        {/*  <input*/}
        {/*    type="hidden"*/}
        {/*    name="name"*/}
        {/*    ref={register({ required: true })}*/}
        {/*    maxLength={255}*/}
        {/*    className={classes.formControlInput}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<p className={classes.formErrorMessage}>*/}
        {/*  {*/}
        {/*    renderError(errors, 'name')*/}
        {/*  }*/}
        {/*</p>*/}


        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>Start Time</label>*/}
        {/*  <div >*/}
        {/*    <Controller*/}
        {/*      control={control}*/}
        {/*      rules={{*/}
        {/*        required: true,*/}
        {/*      }}*/}
        {/*      name="startTime"*/}
        {/*      render={(field) => {*/}
        {/*        return (*/}
        {/*          <DatePicker*/}
        {/*            {...field}*/}
        {/*            format="YYYY-MM-DD HH:mm:ss"*/}
        {/*            showTime={{*/}
        {/*              defaultValue: moment("00:00:00", "HH:mm:ss"),*/}
        {/*              format: "HH:mm"*/}
        {/*            }}*/}
        {/*            minuteStep={15}*/}
        {/*          />*/}
        {/*        )*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <p className={classes.formErrorMessage}>*/}
        {/*    {*/}
        {/*      renderError(errors, 'startTime')*/}
        {/*    }*/}
        {/*  </p>*/}
        {/*</div>*/}




        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>End Time</label>*/}
        {/*  <div >*/}
        {/*    <Controller*/}
        {/*      control={control}*/}
        {/*      rules={{*/}
        {/*        required: true,*/}
        {/*        validate: {*/}
        {/*          greateOrEqualStartTime: value => {*/}
        {/*            const startTime = getValues('startTime');*/}
        {/*            const valueUnix = moment(value).unix();*/}
        {/*            const startTimeUnix = moment(startTime).unix();*/}
        {/*            console.log('Validate Finish Time', valueUnix, startTimeUnix);*/}

        {/*            return startTime ? valueUnix > startTimeUnix : valueUnix > moment().unix();*/}
        {/*          }*/}
        {/*        }*/}
        {/*      }}*/}
        {/*      name="endTime"*/}
        {/*      render={(field) => {*/}
        {/*        return (*/}
        {/*          <DatePicker*/}
        {/*            {...field}*/}
        {/*            format="YYYY-MM-DD HH:mm:ss"*/}
        {/*            showTime={{*/}
        {/*              defaultValue: moment("00:00:00", "HH:mm:ss"),*/}
        {/*              format: "HH:mm"*/}
        {/*            }}*/}
        {/*            minuteStep={15}*/}
        {/*          />*/}
        {/*        )*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <p className={classes.formErrorMessage}>*/}
        {/*    {*/}
        {/*      renderError(errors, 'endTime')*/}
        {/*    }*/}
        {/*  </p>*/}
        {/*</div>*/}




        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>Min Buy</label>*/}
        {/*  <div>*/}
        {/*    <CurrencyInputWithValidate*/}
        {/*      register={register}*/}
        {/*      errors={errors}*/}
        {/*      initValue={editData.minBuy}*/}
        {/*      controlName={'minBuy'}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*<div className={classes.formControl}>*/}
        {/*  <label className={classes.formControlLabel}>Max Buy</label>*/}
        {/*  <div>*/}
        {/*    <CurrencyInputWithValidate*/}
        {/*      register={register}*/}
        {/*      errors={errors}*/}
        {/*      initValue={editData.maxBuy}*/}
        {/*      controlName={'maxBuy'}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}











      </ConfirmDialog>

    </>
  );
}

export default UserParticipantCreatePopup;
