import React from 'react';
import '../styles/new-session.css'
import DropDownSessions from '../components/DropDownSessions'
import {BackButton} from "../components/additional-components/buttons/BackButton";

function OldSessions() {
    return (<>
            <BackButton/>
            <DropDownSessions/>
        </>);
}

export default OldSessions;