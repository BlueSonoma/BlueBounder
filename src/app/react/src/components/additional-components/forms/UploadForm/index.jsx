import { forwardRef, useEffect, useRef, useState } from 'react';
import Button from '../../buttons/Button';

function UploadForm({
                      id,
                      className,
                      style,
                      onChange,
                      onClick,
                      type,
                      acceptTypes,
                      label,
                      browseButtonItem,
                      textForm,
                      textValue,
                      browseButtonProps,
                      placeholder,
                      ...rest
                    }, ref) {

  const [inputValue, setInputValue] = useState(textValue ?? '');
  const textInputRef = useRef();
  const fileInputRef = useRef(ref ?? null);


  useEffect(() => {
    textInputRef.current?.focus();
  }, [inputValue]);

  function onTextInputChangeHandler(event) {
    const input = event.target.value;
    setInputValue(input);
    onChange?.(event, input);
  }

  function onFileChosenChangeHandler(event) {
    const file = event.target.files[0];
    setInputValue(file.path);
    onChange?.(event, file.path);
  }

  const onClickHandler = () => {
    fileInputRef.current?.click();
    onClick?.();
  };

  label = label ?? 'Browse';
  textForm = textForm ?? true;

  function defaultButton() {
    return (<>
      {textForm && (<input
        ref={textInputRef}
        type={'text'}
        value={inputValue}
        onChange={onTextInputChangeHandler}
        placeholder={placeholder}
        className={className}
      />)}
      <Button
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

  return (<div
    id={id}
    className={divClassName}
    style={style ?? {
      display: 'flex', flexDirection: 'column',
    }}
    {...rest}
  >
    <input
      ref={fileInputRef}
      type={'file'}
      accept={acceptTypes}
      style={{ display: 'none' }}
      onChange={onFileChosenChangeHandler}
    />
    <ButtonComponent />
  </div>);
}

export default forwardRef(UploadForm);