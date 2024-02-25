import { forwardRef } from 'react';

import '../../styles/modal.css';

function Modal({ id, style, className, title, children, ...rest }, ref) {
  return (<div
    ref={ref}
    id={id}
    style={style}
    className={'modal ' + className}
    {...rest}
  >
    <div className={'title'}>
      {title}
    </div>
    <div className={'content'}>
      {children}
    </div>
  </div>);
}

export default forwardRef(Modal);