import React from 'react';
import '../../styles/new-session.css';
import DropDown from '../DropDownSessions';
import BackButton from '../../additional-components/buttons/BackButton';
import WindowTitleBar from '../../additional-components/WindowTitleBar';

function OldSessions() {
  return (<div>
    <WindowTitleBar/>
    <BackButton />
    <DropDown />
  </div>);
}

export default OldSessions;