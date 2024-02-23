import { forwardRef } from 'react';
import Button from '../../buttons/Button';

function BaseUploadForm({
                          id,
                          className,
                          style,
                          onChange,
                          onClick,
                          type,
                          acceptTypes,
                          label,
                          buttonItem,
                          textForm,
                          textValue,
                          buttonProps,
                          ...rest
                        }, ref) {

  label = label ?? 'Choose File';
  textForm = textForm ?? true;
  type = type ?? 'file';
  textValue = textValue ?? '';

  let buttonStyle = buttonProps?.style;
  if (typeof buttonStyle === 'undefined') {
    buttonStyle = {
      width: 'fit-content', height: 'fit-content', padding: '5px 10px 5px 10px',
    };
  }

  function defaultButton() {
    return (<>
      {textForm && (<input
        type={'text'}
        value={textValue}
        readOnly
      />)}
      <Button
        onClick={onClick}
        style={buttonStyle}
        {...buttonProps}
        label={label}
      />
    </>);
  }

  let ButtonComponent = buttonItem?.component;
  if (typeof ButtonComponent === 'undefined') {
    ButtonComponent = defaultButton;
  }

  return (<>
    <input
      ref={ref}
      type={type}
      accept={acceptTypes}
      style={style}
      onChange={onChange}
    />
    <ButtonComponent />
  </>);
}

export default forwardRef(BaseUploadForm);