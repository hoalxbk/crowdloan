import React, { useState, useEffect, useRef } from 'react';
import { TextField, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';
import { alertFailure } from '../../store/actions/alert';
import { getUserDetail, updateUserProfile, clearUserProfileUpdate } from '../../store/actions/user';
import { BaseRequest } from '../../request/Request';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import DefaultLayout from '../../components/Layout/DefaultLayout';
import useStyles from './style';
import {apiRoute} from "../../utils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const Profile: React.FC = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const { register, getValues, setValue, clearErrors, setError, handleSubmit, errors } = useForm({});
  const { data: loginUser } =  useTypedSelector(state => state.user);
  const { data: userProfile, loading: userProfileLoading } = useTypedSelector(state => state.userProfile);
  const { loading: userProfileUpdateLoading, data: userProfileUpdate, error } = useTypedSelector(state => state.userProfileUpdate);

  useEffect(() => {
    dispatch(getUserDetail());
    return () => {
      dispatch(clearUserProfileUpdate());
    }
  }, [dispatch, userProfileUpdate]);

  useEffect(() => {
    error && dispatch(alertFailure(error));
  }, [error]);

  const handleUploadError = (errors: any, prop: any) => {
      if (errors && errors[prop]) {
        return <span className="error">{errors[prop].message}</span>
      }
  }

  const uploadImage = (imageType: string, file: any) => {
    let request = new BaseRequest();
    var form_data = new FormData();
    form_data.append('avatar', file);

    request.postImage(apiRoute('/upload-avatar'), form_data)
      .then((response: any) => response.json())
      .then(data => {
        if (data.status === 200) {
          setValue(imageType, data.data.fileName);
        }
        setFileUploadLoading(false);
      })
      .catch((error) => {
        console.log(error)
      });
  };

  const handleFormSubmit = (data:any) => {
    dispatch(updateUserProfile(data));
  }

  return (
    <DefaultLayout>
      {
        userProfileLoading ? (
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <CircularProgress size={70} />
            <p style={{ marginTop: 30, fontSize: 18, fontWeight: 600 }}>Loading User Profile ...</p>
          </div>
        ): (
          <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
            <div className={styles.formContent}>
              <div className={styles.formLeft}>
              <TextField className={styles.formField} name="userName" inputRef={register()} label="Username" defaultValue={userProfile?.username} disabled />
                <TextField className={styles.formField} name="wallet_address" label="Current Ethereum Address" defaultValue={userProfile?.wallet_address} disabled />
                <TextField className={styles.formField} name="email" label="Email" defaultValue={loginUser?.email} disabled />
              </div>
              <div className={styles.formRight}>
                <div className={styles.formAvatarContainer}>
                  {
                    fileUploadLoading ? <CircularProgress size={130} />: getValues('avatar') ? <img src={`${API_BASE_URL}/image/${getValues('avatar')}`} className={styles.formAvatar} />: !userProfile?.avatar ? <AccountCircleIcon style={{ fontSize: 120 }} /> : <img src={`${API_BASE_URL}/image/${userProfile.avatar}`} className={styles.formAvatar} />
                  }
                </div>
                <p className={styles.formErrorMessage}>
                  {
                    handleUploadError(errors, 'avatar')
                  }
                </p>

              </div>
            </div>
            <Link to="/change-password/user" className={styles.formRedirect}>Change password ?</Link>
          </form>
        )
      }
    </DefaultLayout>
  )
}

export default Profile;
