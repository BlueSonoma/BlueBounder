import { createRef, useState } from 'react';
import BaseUploadForm from '../BaseUploadForm';

function ImageUploadForm({
                           id,
                           style,
                           className,
                           buttonItem,
                           label,
                           onClick,
                           onChange,
                           acceptTypes,
                           textForm,
                           buttonProps,
                         }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = createRef();

  acceptTypes = acceptTypes ?? '.jpg, .jpeg, .png, .gif, .bmp, .svg, .webp';

  function onChangeHandler(event) {
    const imageFile = event.target.files[0];
    setSelectedFile(imageFile);
    onChange?.(imageFile);
  }

  const onClickHandler = () => {
    fileInputRef.current.click();
    onClick?.();
  };

  return (<div
    id={id}
    className={className}
    style={style ?? {
      display: 'flex', flexDirection: 'column',
    }}
  >
    <BaseUploadForm
      ref={fileInputRef}
      style={{ display: 'none' }}
      accept={acceptTypes}
      onChange={onChangeHandler}
      onClick={onClickHandler}
      textForm={textForm}
      textValue={selectedFile}
      buttonItem={buttonItem}
      label={label}
      buttonProps={buttonProps}
    />
  </div>);
}

export default ImageUploadForm;
