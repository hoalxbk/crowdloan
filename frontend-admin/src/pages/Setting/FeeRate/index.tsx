import React, { useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/Base/Button';
import _ from 'lodash';

const FreeRate = (props: any) => {
  const {
    mainClass = '',
    loading = false,
    isOwnerRole = false,
  } = props;
  const { register, setValue, errors, handleSubmit, control } = useForm({
    mode: 'onChange'
  });

  const feeRateRef = useRef(null) as any;
  useEffect(() => {
    if (feeRateRef.current) {
      register(feeRateRef.current, {
        required: true,
      });
    }
  }, [feeRateRef.current]);

  useEffect(() => {
    const { defaultFeeRate = '' } = props;
    setValue('feeRate', defaultFeeRate);
  }, [setValue, props.defaultFeeRate]);

  const renderError = (errors: any, fieldName: string) => {
    const errorType = _.get(errors, `[${fieldName}.type]`, '');
    if (!errorType) {
      return;
    }
    if (errorType === 'required') {
      return 'This field is required';
    }
  };

  const onSubmit = (data: any) => {
    const { feeRate = ''} = data;
    const { setFeeRateSubmit } = props;
    setFeeRateSubmit(feeRate);
  };

  const onEdit = () => {
    if (feeRateRef && feeRateRef.current) {
      feeRateRef.current.focus();
    }
  };

  return (
    <form
      className={`${mainClass}__form`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`${mainClass}__form-wrapper`}>
        <div className={`${mainClass}__form-item`}>
          <div className={`${mainClass}__item-label`}>
            <label className={`${mainClass}__item-label-text`}>
              Fee Rate
            </label>
            {isOwnerRole && (
              <span
                className={`${mainClass}__item-edit`}
                onClick={onEdit}
                title="Edit"
              >
                Edit
              </span>
            )}
          </div>

          <input
            type="text"
            name="feeRate"
            ref={feeRateRef}
            className={`${mainClass}__item-input`}
            disabled={!isOwnerRole}
          />
        </div>

        {isOwnerRole && (
          <div className={`${mainClass}__form-button`}>
            <Button
              buttonType="primary"
              label="Save"
              loading={loading}
              disabled={loading}
            />
          </div>
        )}
      </div>
      {errors.feeRate && (
        <p className={`${mainClass}__item-error text-danger`}>
          {renderError(errors, 'feeRate')}
        </p>
      )}
    </form>
  );
};

export default FreeRate;