import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import useStyles from './style';
import useCommonStyle from '../../../styles/CommonStyle';

const iconClose = 'images/icons/close.svg';
const background = 'images/landing/bg-modal.svg';

const ModalContent = (props: any) => {
  const styles = useStyles();
  const commonStyles = useCommonStyle();
  const {
    setShowModal
  } = props;

  return (
    <>
      <div className={commonStyles.modal + ' ' + styles.ModalContent}>
        <div className="modal-content">
          <img src={background} className="bg"/>
          <img src={iconClose} onClick={() => setShowModal(false)} className="btn-close"/>
          <div className="modal-content__head">
            <h2 className="title">The first IDO will start in the first half of May.</h2>
          </div>
          <div className="modal-content__body">
            <div className="subtitle">
              <span>Subscribe PolkaFoundry Telegram for the latest updates.</span>
            </div>
          </div>
          <div className="modal-content__foot">
            <button
              className={"btn-approve"}
              onClick={() => {window.open('https://t.me/PolkaFoundryANN', '_blank')}}
            >Subscribe</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalContent;
