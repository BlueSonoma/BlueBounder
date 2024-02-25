import React from 'react';
import '../../styles/new-session.css';
import DropDown from '../DropDownSessions';
import BackButton from '../additional-components/buttons/BackButton';
import AppTitleBar from '../AppTitleBar';

function OldSessions() {
  return (<div>
    <AppTitleBar/>
    <BackButton />
    <DropDown />
  </div>);
}

export default OldSessions;