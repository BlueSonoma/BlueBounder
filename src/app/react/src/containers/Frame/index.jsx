import '../../styles/bounder.css';


function Frame({ label, bodyProps, children, ...rest }) {
  return (<div className={'bounder__frame'}>
    <div className={'header'} {...rest}>{label ?? ''}</div>
    <div className={'body'} {...bodyProps}>
      {children}
    </div>
  </div>);
}

export default Frame;