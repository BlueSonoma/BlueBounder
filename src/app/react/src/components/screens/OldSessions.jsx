import React from 'react';
import '../../styles/new-session.css';
import DropDown from '../DropDownSessions';
import BackButton from '../additional-components/buttons/BackButton';

function OldSessions() {
  return (<div>
    <BackButton />
    <DropDown />
  </div>);
}

export default OldSessions;