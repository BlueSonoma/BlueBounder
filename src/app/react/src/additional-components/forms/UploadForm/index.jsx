import { forwardRef, useEffect, useRef, useState } from 'react';
import Button from '../../buttons/Button';
import { getRelativePath } from '../../../utils/general';

function UploadForm({
                      id,
                      className,
                      style,
                      multiple = false,
                      disabled,
                      onChange,
                      onClick,
                      type,
                      acceptTypes,
                      label = 'Browse',
                      browseButtonItem,
                      textForm = true,
                      textFormStyle,
                      textValue = '',
                      browseButtonProps,
                      placeholder,
                      ...rest
                    }, ref = null) {

  const [inputValue, setInputValue] = useState(textValue);
  const textInputRef = useRef(null);
  const fileInputRef = useRef(ref);

  useEffect(() => {
    textInputRef.current?.focus();
  }, [inputValue]);

  function onTextInputChangeHandler(event) {
    const input = event.target.value;
    setInputValue(input);
    onChange?.(event, input);
  }

  function onFileChosenChangeHandler(event) {
    let path = event.target.files[0].path;
    setInputValue(path);
    onChange?.(event, path);
  }

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  function defaultButton() {
    return (<>
      {textForm && (<input
        disabled={disabled}
        ref={textInputRef}
        type={'text'}
        value={inputValue}
        onChange={onTextInputChangeHandler}
        placeholder={placeholder}
        className={className}
      />)}
      <Button
        disabled={disabled}
        onClick={onClickHandler}
        {...browseButtonProps}
        label={label}
      />
    </>);
  }

  let ButtonComponent = browseButtonItem?.component;
  if (typeof ButtonComponent === 'undefined') {
    ButtonComponent = defaultButton;
  }

  const divClassName = textForm ? '' : className;

  const divProps = {
    id: id, className: divClassName, style: style ?? {
      display: 'flex', flexDirection: 'column',
    }, ...rest,
  };

  const inputProps = {
    ref: fileInputRef,
    type: 'file',
    accept: acceptTypes,
    style: { display: 'none' },
    onClick: onClick?.(),
    onChange: onFileChosenChangeHandler,
    disabled: disabled,
  };

  return (<div {...divProps}>
    {multiple ? <input {...inputProps} multiple /> : <input {...inputProps} />}
    <ButtonComponent disabled={disabled} />
  </div>);
}

export default forwardRef(UploadForm);