import React from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {useForm} from "react-hook-form";
import {renderErrorCreatePool} from "../../../../utils/validate";

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
  });

  const submitData = (data: any) => {
    handleCreateUpdateData && handleCreateUpdateData(data);
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

  return (
    <>
      <ConfirmDialog
        title={isEdit ? 'Edit' : 'Create'}
        open={isOpenEditPopup}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => { setIsOpenEditPopup(false); clearErrors() }}
      >

        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Email</label>
          <input
            type="email"
            name="email"
            ref={register({ required: true })}
            maxLength={255}
            className={classes.formControlInput}
          />
        </div>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'email')
          }
        </p>


        <div className={classes.formControl}>
          <label className={classes.formControlLabel}>Wallet address</label>
          <input
            name="wallet_address"
            ref={register({ required: true })}
            maxLength={255}
            className={classes.formControlInput}
          />
        </div>
        <p className={classes.formErrorMessage}>
          {
            renderError(errors, 'wallet_address')
          }
        </p>

      </ConfirmDialog>

    </>
  );
}

export default UserParticipantCreatePopup;
