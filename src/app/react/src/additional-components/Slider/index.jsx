function Slider({
                  label,
                  min,
                  max,
                  step,
                  value,
                  labelStyle,
                  onChange,
                  showValue = true,
                  valueStyle,
                  customValue,
                  sliderStyle,
                  disabled,
                  editable = true,
                  ...rest
                }) {
  const textValue = customValue ?? value;

  function onTextChangeHandler(event) {
    if (editable) {
      onChange?.(event);
    }
  }

  return (<span
    style={{
      display: 'flex', flexDirection: 'row', width: '100%', paddingTop: '5px', paddingBottom: '3px',
    }} {...rest}>
        {label && <label style={{ padding: '3px', ...labelStyle }}>{label}</label>}
    <input
      disabled={disabled}
      type={'range'}
      style={{ width: '100%', ...sliderStyle }}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
    {showValue && <input
      value={textValue}
      onChange={onTextChangeHandler}
      type={'text'}
      disabled={disabled}
      style={{
        fontSize: '14px',
        width: `20%`,
        marginRight: '2px',
        textAlign: 'center',
        border: 'groove 2px',
        borderRadius: '6px', ...valueStyle,
      }}
    />}
        </span>);
}

export default Slider;