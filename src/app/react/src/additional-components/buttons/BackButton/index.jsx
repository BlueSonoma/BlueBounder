import '../../../styles/back-button.css';
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Routes from '../../../routes';

export function BackButton() {
  const navigate = useNavigate();
  return (<>
    <button className={'backButton'} onClick={() => navigate(Routes.Root)}>Back</button>
  </>);
}

export default memo(BackButton);