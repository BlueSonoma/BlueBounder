import React from 'react';
import '../styles/new-session.css'
import DropDown from '../components/DropDownSessions'
import BackButton from '../components/additional-components/buttons/BackButton';

function OldSessions() {
    return (<div>
        <BackButton/>
        <DropDown/>
    </div>);
}

export default OldSessions;