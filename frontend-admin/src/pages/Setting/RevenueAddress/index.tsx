import React, {useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/Base/Button';
import _ from 'lodash';

const RevenueAddress = (props: any) => {
  const {
    mainClass = '',
    loading = false,
    isOwnerRole = false,
  } = props;
  const { register, setValue, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const revenueAddressRef = useRef(null) as any;
  useEffect(() => {
    if (revenueAddressRef.current) {
      register(revenueAddressRef.current, {
        required: true,
      });
    }
  }, [revenueAddressRef.current]);

  useEffect(() => {
    const { defaultRevenueAddress = '' } = props;
    setValue('revenueAddress', defaultRevenueAddress);
  }, [setValue, props.defaultRevenueAddress]);

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
    const { revenueAddress = ''} = data;
    const { setRevenueAddressSubmit } = props;
    setRevenueAddressSubmit(revenueAddress);
  };

  const onEdit = () => {
    if (revenueAddressRef && revenueAddressRef.current) {
      revenueAddressRef.current.focus();
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
              Revenue Address
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
            name="revenueAddress"
            ref={revenueAddressRef}
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
      {errors.revenueAddress && (
        <p className={`${mainClass}__item-error text-danger`}>
          {renderError(errors, 'revenueAddress')}
        </p>
      )}
    </form>
  );
};

export default RevenueAddress;