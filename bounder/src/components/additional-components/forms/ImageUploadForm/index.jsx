import { createRef, useState } from 'react';

function ImageUploadForm({
  id,
  style,
  buttonStyle,
  className,
  buttonComponent: Button,
  buttonProps,
  buttonClassName,
  buttonLabel,
  onClick,
  onChange,
  acceptTypes,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = createRef();

  function onChangeHandler(event) {
    const imageFile = event.target.files[0];
    setSelectedFile(imageFile);
    onChange?.(imageFile);
  }

  const onClickHandler = () => {
    fileInputRef.current.click();
    onClick?.();
  };

  return (
    <div
      id={id}
      className={className}
      style={
        style ?? {
          display: 'flex',
          flexDirection: 'column',
        }
      }
    >
      <input
        type={'file'}
        accept={acceptTypes ?? '.jpg, .jpeg, .png, .gif, .bmp, .svg, .webp'}
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={onChangeHandler}
      />
      {Button ? (
        <Button {...buttonProps} onClick={onClickHandler}/>
      ) : (
        <>
          <input type={'text'} value={selectedFile ? selectedFile.name : ''} readOnly />
          <button onClick={onClickHandler} style={buttonStyle}>
            {buttonLabel ?? 'Choose File'}
          </button>
        </>
      )}
    </div>
  );
}

export default ImageUploadForm;
