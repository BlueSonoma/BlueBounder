import UploadForm from '../UploadForm';

function ImageUploadForm({
                           id,
                           style,
                           className,
                           label,
                           onClick,
                           onChange,
                           acceptTypes,
                           textForm,
                           placeholder,
                           browseButtonProps,
                           browseButtonItem,
                         }) {

  acceptTypes = acceptTypes ?? '.jpg, .jpeg, .png, .gif, .bmp, .svg, .webp';

  return (
    <UploadForm
      id={id}
      className={className}
      style={style}
      acceptTypes={acceptTypes}
      onChange={onChange}
      onClick={onClick}
      textForm={textForm}
      browseButtonItem={browseButtonItem}
      label={label}
      browseButtonProps={browseButtonProps}
      placeholder={placeholder}
    />);
}

export default ImageUploadForm;
