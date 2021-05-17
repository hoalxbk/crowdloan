import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import useComponentStyles from "./style_components";
import FormControl from '@material-ui/core/FormControl';
import ImageUploading from 'react-images-uploading';
import {uploadFile} from "../../../request/upload";
import Button from '@material-ui/core/Button';
import { imageRoute } from "../../../utils";
import { renderErrorCreatePool } from "../../../utils/validate";
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { Image } from 'antd';
import {useCommonStyle} from "../../../styles";

// https://codesandbox.io/s/react-images-uploading-demo-u0khz?file=/src/index.js
function TokenLogoOld(props: any) {
  const classes = useStyles();
  const classesComponent = useComponentStyles();
  const commonStyle = useCommonStyle();
  const {
    register, errors,
    poolDetail
  } = props;
  const renderError = renderErrorCreatePool;
  const maxNumber = 69;
  const [images, setImages] = React.useState([]);
  const [imageUploaded, setImageUploaded] = useState('');

  useEffect(() => {
    if (poolDetail && poolDetail.token_images) {
      // @ts-ignore
      setImages([{ data_url: imageRoute(poolDetail.token_images) }]);
      setImageUploaded(poolDetail.token_images);
    }
  }, [poolDetail]);

  const onChange = async (imageList: any, addUpdateIndex: any) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    if (imageList.length > 0) {
      for (let index in imageList) {
        await uploadFile(imageList[index].file)
          .then((res) => {
            const fileName = res.data && res.data.fileName;
            console.log('fileName', fileName);
            setImageUploaded(fileName);
          });
      }
    }
  };

  return (
    <>
      <div className={classes.formControl}>
        <FormControl component="fieldset">
          <label className={classes.formControlLabel}>Tokens Icon</label>

          <ImageUploading
            // multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            maxFileSize={5000000}
            acceptType={['jpg', 'gif', 'png']}
          >
            {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors,
              }) => (
              // write your building UI
              <div className={classesComponent.uploadImageWrapper}>
                <Button variant="contained" color="primary" onClick={onImageUpload}>
                  Upload
                </Button>
                {imageList.map((image, index) => (
                  <div key={index} className={classesComponent.imageItem}>
                    <Image
                      width={100}
                      src={image['data_url']}
                    />
                    <div className={classesComponent.imageItemBtnWrapper}>
                      <EditFilled
                        className={classesComponent.btnUpdateItem}
                        onClick={() => onImageUpdate(index)}
                      /> Edit
                      <DeleteFilled
                        className={classesComponent.btnUpdateRemove}
                        onClick={() => {
                          // eslint-disable-next-line no-restricted-globals
                          if (!confirm('Do you want delete this image?')) {
                            return false;
                          }
                          setImageUploaded('');
                          return onImageRemove(index);
                        }}
                      /> Remove
                    </div>
                  </div>
                ))}
                {errors &&
                <div className={commonStyle.error}>
                  {errors.maxNumber && <span>Number of selected images exceed 1</span>}
                  {errors.acceptType && <span>The selected file must be in PNG format, up to 5MB in size.</span>}
                  {errors.maxFileSize && <span>Selected file size exceed 5MB</span>}
                  {errors.resolution && <span>Selected file is not match your desired resolution</span>}
                </div>
                }
              </div>
            )}
          </ImageUploading>
          <input
            type='hidden'
            name='tokenImages'
            value={imageUploaded}
            ref={register({
              required: true
            })}
          />
          <p className={classes.formErrorMessage}>
            {
              renderError(errors, 'tokenImages')
            }
          </p>
        </FormControl>
      </div>
    </>
  );
}

export default TokenLogoOld;
