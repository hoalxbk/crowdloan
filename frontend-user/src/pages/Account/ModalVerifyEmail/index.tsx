import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';
import { approve } from '../../../store/actions/sota-token';
import { deposit } from '../../../store/actions/sota-tiers';
import { convertFromWei, convertToWei, convertToBN } from '../../../services/web3';
import { useWeb3React } from '@web3-react/core';
import useEmail from '../../../hooks/useEmail';
import useWalletSignature from '../../../hooks/useWalletSignature';
import axios from 'axios';
import { alertFailure, alertSuccess } from '../../../store/actions/alert';

const closeIcon = '/images/icons/close.svg';

const ModalVerifyEmail = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const dispatch = useDispatch();

  const { account: connectedAccount } = useWeb3React();
  const { signature, signMessage, setSignature, error } = useWalletSignature();
  const [inputEmail, setInputEmail] = useState('');

  const {
    setOpenModalVerifyEmail,
    email,
    setEmail
  } = props;
  
  useEffect(() => {
    setInputEmail(email);
  }, [email])

  useEffect(() => {
    if(signature != '') {
      const data = {
        email: inputEmail,
        signature: signature,
        wallet_address: connectedAccount || ''
      }
      console.log(data)
      const options = {
        headers: {
          msgSignature: process.env.REACT_APP_MESSAGE_INVESTOR_SIGNATURE
        }
      }
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/register-email`, data, options)
      .then(res => {
        !email && setEmail(inputEmail)
        dispatch(alertSuccess('Register success, please check verify email'));
        setOpenModalVerifyEmail(false);
      }).catch(() => {
        dispatch(alertFailure('email register failure, please try again later'));
      })
    }
  }, [signature])

  const handleVerifyEmail = () => {
    signMessage()
  }

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.modalVerifyEmail}>
        <div className="modal-content">
          <div className="modal-content__head">
            <img src={closeIcon} className="btn-close" onClick={() => setOpenModalVerifyEmail(false)}/>
            <h2 className="title">Verify Email</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>Email</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                value={inputEmail}
                onChange={e => setInputEmail(e.target.value)}
                placeholder="Please enter email"
                disabled={email}
              />
            </div>
          </div>
          <div className="modal-content__foot">
            <button
              className={"btn-approve"}
              onClick={() => handleVerifyEmail()}
            >Verify</button>
            <button
              className="btn-cancel"
              onClick={() => setOpenModalVerifyEmail(false)}
            >cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalVerifyEmail;
