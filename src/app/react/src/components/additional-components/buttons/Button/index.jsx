import React, { memo } from 'react';
import { ControlButton } from '@xyflow/react';

function Button({ id, className, style, onClick, imageUrl, imageStyle, alt, title, label, children }) {
  return (
    <ControlButton id={id} style={style} onClick={onClick} className={className} title={title}>
      {imageUrl ? <img style={imageStyle} src={imageUrl} alt={alt} /> : null}
      {label ? <label>{label}</label> : null}
      {children}
    </ControlButton>
  );
}

export default memo(Button);
