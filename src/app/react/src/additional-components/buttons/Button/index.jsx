import React, { memo, useState } from 'react';
import { ControlButton } from '@xyflow/react';

import '../../../styles/bounder.css';
import { HTMLProps } from 'react';
import { getNextId } from '../../../utils/general';

function Button({ id, imageUrl, imageStyle, alt, title, label, children, ...rest }: HTMLProps) {
  const [buttonId] = useState(id ?? `button__${getNextId(2)}`);

  function onMouseUpHandler(event) {
    document.querySelector(`#${buttonId}`)?.classList.toggle('select', false);
    rest.onMouseUp?.(event);
  }

  function onMouseDownHandler(event) {
    document.querySelector(`#${buttonId}`)?.classList.toggle('select', true);
    rest.onMouseDown?.(event);
  }

  return (<ControlButton
    id={buttonId}
    title={title}
    onClick={rest.onClick}
    onMouseDown={onMouseDownHandler}
    onMouseUp={onMouseUpHandler}
    {...rest}
  >
    {imageUrl && <img style={imageStyle} src={imageUrl} alt={alt} />}
    {label && <label>{label}</label>}
    {children}
  </ControlButton>);
}

export default memo(Button);
