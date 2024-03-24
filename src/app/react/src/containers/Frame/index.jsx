import '../../styles/bounder.css';
import { HTMLProps } from 'react';

function Frame({ label, bodyProps, children, ...rest }: HTMLProps) {
  return (<div className={'bounder__frame'}>
    {label && <div className={'header'} {...rest}>{label}</div>}
    <div className={'body'} {...bodyProps}>
      <div className={'content'}>
        {children}
      </div>
    </div>
  </div>);
}

export default Frame;