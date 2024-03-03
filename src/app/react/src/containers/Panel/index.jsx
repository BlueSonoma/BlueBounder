// https://github.com/xyflow/xyflow/blob/v11/packages/core/src/components/Panel/index.tsx/#L14

function Panel({ position, children, className, style, ...rest }) {
  const positionClasses = `${position}`.split('-');

  return (<div
    className={'react-flow__panel ' + className + ` ${positionClasses.map((pos) => pos + ' ')}`}
    style={{ ...style }}
    {...rest}
  >
    {children}
  </div>);
}

export default Panel;