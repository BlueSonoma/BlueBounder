function Slider({
                  label, min, max, step, value, onChange, showValue = true, customValue, sliderStyle, disabled, ...rest
                }) {
  const textValue = customValue ?? value;

  return (<span
    style={{
      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%',
    }} {...rest}>
        {label && <label style={{ padding: '3px' }}>{label}</label>}
    <input
      disabled={disabled}
      type={'range'}
      style={{ width: '300px', ...sliderStyle }}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
    {showValue && <input
      value={value}
      type={'text'}
      disabled={disabled}
      style={{
        width: `20px`,
        justifyContent: 'center',
        padding: '3px',
        border: 'groove 2px',
        borderRadius: '6px',
      }}
    />}
        </span>);
}

export default Slider;