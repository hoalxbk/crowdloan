import React, {useEffect, useState} from 'react';
import useStyles from "../style";
import useComponentStyles from "./style_components";
import FormControl from '@material-ui/core/FormControl';
import ImageUploading from 'react-images-uploading';
import {uploadFile} from "../../../request/upload";
import Button from '@material-ui/core/Button';
import {imageRoute} from "../../../utils";
import {renderErrorCreatePool} from "../../../utils/validate";

// https://codesandbox.io/s/react-images-uploading-demo-u0khz?file=/src/index.js
function TokenLogo(props: any) {
  const classes = useStyles();
  const classesComponent = useComponentStyles();
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
          <label className={classes.formControlLabel}>Tokens Image</label>

          <ImageUploading
            // multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
              // write your building UI
              <div className={classesComponent.uploadImageWrapper}>
                <Button variant="contained" color="primary" onClick={onImageUpload}>
                  Upload
                </Button>
                {imageList.map((image, index) => (
                  <div key={index} className={classesComponent.imageItem}>
                    <img src={image['data_url']} alt="" width="100" />
                    <div className={classesComponent.imageItemBtnWrapper}>
                      <button
                        onClick={() => onImageUpdate(index)}
                        className={classesComponent.btnUpdateItem}
                      >Update</button>
                      <button
                        onClick={() => onImageRemove(index)}
                        className={classesComponent.btnUpdateRemove}
                      >Remove</button>
                    </div>
                  </div>
                ))}
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

export default TokenLogo;
