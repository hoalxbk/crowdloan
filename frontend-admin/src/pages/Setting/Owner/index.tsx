import React, {useEffect, useRef} from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/Base/Button';
import _ from 'lodash';

const Owner = (props: any) => {
  const {
    mainClass = '',
    loading = false,
    isOwnerRole = false,
  } = props;
  const { register, setValue, errors, handleSubmit } = useForm({
    mode: 'onChange'
  });

  const ownerRef = useRef(null) as any;

  useEffect(() => {
    if (ownerRef.current) {
      register(ownerRef.current, {
        required: true,
      });
    }
  }, [ownerRef.current]);

  useEffect(() => {
    const { defaultOwner = '' } = props;
    setValue('owner', defaultOwner);
  }, [setValue, props.defaultOwner]);

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
    const { owner = ''} = data;
    const { setOwnerSubmit } = props;
    setOwnerSubmit(owner);
  };

  const onEdit = () => {
    if (ownerRef && ownerRef.current) {
      ownerRef.current.focus();
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
              Owner
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

          <div className={`${mainClass}__item-warning text-danger`}>
            Action can not revert, please make sure before change owner
          </div>
          <input
            type="text"
            name="owner"
            ref={ownerRef}
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
      {errors.owner && (
        <p className={`${mainClass}__item-error text-danger`}>
          {renderError(errors, 'owner')}
        </p>
      )}
    </form>
  );
};

export default Owner;