import UploadForm from '../UploadForm';

function ImageUploadForm({
                           id,
                           style,
                           className,
                           label,
                           onClick,
                           onChange,
                           multiple,
                           acceptTypes,
                           textForm,
                           textFormStyle,
                           placeholder,
                           browseButtonProps,
                           browseButtonItem,
                           disabled,
                         }) {

  acceptTypes = acceptTypes ?? '.jpg, .jpeg, .png, .gif, .bmp, .svg, .webp';

  return (<UploadForm
    id={id}
    className={className}
    style={style}
    multiple={multiple}
    disabled={disabled}
    acceptTypes={acceptTypes}
    onChange={onChange}
    onClick={onClick}
    textForm={textForm}
    textFormStyle={textFormStyle}
    browseButtonItem={browseButtonItem}
    label={label}
    browseButtonProps={browseButtonProps}
    placeholder={placeholder}
  />);
}

export default ImageUploadForm;
