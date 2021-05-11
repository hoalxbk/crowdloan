import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {pickerRandomWinner} from "../../../../request/participants";
import {useDispatch} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";

function UserPickerToWinner(props: any) {
  const commonStyle = useCommonStyle();
  const { poolDetail } = props;
  const dispatch = useDispatch();
  const [inputPicker, setInputPicker] = useState('');

  const handlePickerRandom = async (e: any) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want pick random ?')) {
      return false;
    }

    const pickerNumber = parseInt(inputPicker);
    console.log('pickerNumber', pickerNumber);

    // Call API random
    await pickerRandomWinner(poolDetail?.id, pickerNumber)
      .then((res) => {
        console.log('[pickerRandomWinner] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Picker to Random Success'));
        } else {
          dispatch(alertFailure('Picker to Random Fail'));
        }
      });
  };

  return (
    <>
      <div style={{
        paddingLeft: 60,
        display: 'inline-block',
      }}>
        <input
          type={'number'}
          className={commonStyle.inputSearch}
          placeholder="Picker to winner"
          style={{
            width: 180,
          }}
          value={inputPicker}
          min={0}
          step={1}
          onChange={(e) => {
            setInputPicker(e.target.value)
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handlePickerRandom}
          style={{ marginLeft: 10, marginTop: -5 }}
        >Pick</Button>
      </div>

    </>
  );
}

export default UserPickerToWinner;
