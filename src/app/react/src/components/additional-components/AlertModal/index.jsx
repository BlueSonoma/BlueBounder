import Modal from '../../../containers/Modal';
import Button from '../buttons/Button';

function AlertModal({ id, style, className, message, title, onClose, buttonProps, children, ...rest }) {

  title = title ?? 'Alert';
  buttonProps = {
    ...buttonProps, label: buttonProps?.label ?? 'Close',
  };

  return (<Modal
    id={id}
    className={className}
    style={{ ...style, opacity: 1 }}
    title={title}
    {...rest}>
    <label>{message}</label>
    <Button
      className={buttonProps.className}
      style={{
        ...buttonProps.style,
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        width: 'fit-content',
        height: 'fit-content',
        padding: '7px 10px 7px 10px',
      }}
      title={buttonProps.title ?? buttonProps.label}
      onClick={onClose}
      {...buttonProps}
    ></Button>
  </Modal>);
}

export default AlertModal;