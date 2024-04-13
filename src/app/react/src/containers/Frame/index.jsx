import '../../styles/bounder.css';
import { HTMLProps } from 'react';

function Frame({ label, bodyProps, children, labelProps, bodyStyle, contentProps ,...rest }: HTMLProps) {
  return (<div className={'bounder__frame'} {...rest}>
    {label && <div className={'header'} {...labelProps}>{label}</div>}
    <div className={'body'} {...bodyProps}>
      <div className={'content'} {...contentProps}>
        {children}
      </div>
    </div>
  </div>);
}

export default Frame;