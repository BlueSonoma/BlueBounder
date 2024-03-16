import IconSelect from '../../resources/icons/cursor.png';
import IconPlus from '../../resources/icons/plus.png';
import IconRotate from '../../resources/icons/rotate.png';
import React, { memo, useEffect, useState } from 'react';
import { SelectorModes } from '../../utils/selector-modes';
import '../../styles/mode-selector.css';
import useSelectorMode from '../../hooks/useSelectorMode';
import Button from '../buttons/Button';

function ModeSelector({ initialMode, className, style, children }) {
  const { selectorMode, setSelectorMode } = useSelectorMode();
  const [currButtonId, setCurrButtonId] = useState(() => {
    if (typeof initialMode === 'undefined') {
      return `button__${selectorMode}`;
    }
    return `button__${initialMode}`;
  });

  function keyPressHandler(event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    switch (event.key) {
      case 'a':
        selectButtonById(`button__${SelectorModes.AddEllipse}`, SelectorModes.AddEllipse);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'f':
        selectButtonById(`button__${SelectorModes.FreeMove}`, SelectorModes.FreeMove);
        event.preventDefault();
        event.stopPropagation();
        break;
      case 'r':
        selectButtonById(`button__${SelectorModes.Rotate}`, SelectorModes.Rotate);
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', keyPressHandler);
    return () => document.removeEventListener('keydown', keyPressHandler);
  }, [keyPressHandler]);

  useEffect(() => {
    if (initialMode) {
      setSelectorMode(initialMode);
    }
  }, []);

  useEffect(() => {
    document.getElementById(currButtonId)?.classList.toggle('select', true);
  }, []);

  function selectButtonById(id, mode) {
    if (currButtonId === id) {
      return;
    }
    document.getElementById(currButtonId)?.classList.toggle('select', false);
    document.getElementById(id)?.classList.toggle('select', true);
    setSelectorMode(mode);
    setCurrButtonId(id);
  }

  function onClickModeSelectorHandler(event, mode) {
    selectButtonById(event.target.id, mode);
    event.stopPropagation();
  }

  return (<div className={'bounder__mode-selector ' + className} style={style}>
      <Button
        id={`button__${SelectorModes.FreeMove}`}
        onClick={(event) => onClickModeSelectorHandler(event, SelectorModes.FreeMove)}
        imageUrl={IconSelect}
        title={'Select'}
      />
      <Button
        id={`button__${SelectorModes.AddEllipse}`}
        onClick={(event) => onClickModeSelectorHandler(event, SelectorModes.AddEllipse)}
        imageUrl={IconPlus}
        title={'Add Ellipse'}
      />
      <Button
        id={`button__${SelectorModes.Rotate}`}
        onClick={(event) => onClickModeSelectorHandler(event, SelectorModes.Rotate)}
        imageUrl={IconRotate}
        title={'Rotate'}
      />
      {children}
    </div>);
}

export default memo(ModeSelector);
