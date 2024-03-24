import React, { useEffect, useState } from 'react';
import Button from '../../buttons/Button';
import { channels } from '../../../shared/constants';

const { electron } = window;

function DirectoryPicker({
                           id,
                           disabled,
                           textFormId,
                           buttonId,
                           className,
                           textFormClassName,
                           buttonClassName,
                           style,
                           textFormStyle,
                           buttonLabel = 'Select',
                           buttonStyle,
                           onChange,
                           value,
                           ...rest
                         }) {
  function onOpenDialogHandler() {
    electron.openDirectoryDialog();
  }

  useEffect(() => {
    function updatePath(event) {
      if (event.data.type === channels.SelectDirectoryDialog) {
        onChange?.(event, event.data.path);
      }
    }

    window.addEventListener('message', updatePath);
    return () => {
      window.removeEventListener('message', updatePath);
    };
  }, []);

  return (<div
    id={id}
    className={className}
    style={style}
  >
    <input
      id={textFormId}
      type={'text'}
      className={textFormClassName}
      disabled={disabled}
      value={value}
      style={{ width: '100%', ...textFormStyle }}
      {...rest}
    />
    <Button
      id={buttonId}
      disabled={disabled}
      label={buttonLabel}
      style={buttonStyle}
      onClick={onOpenDialogHandler}
    />
  </div>);
}

export default DirectoryPicker;