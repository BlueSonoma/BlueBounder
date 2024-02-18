import '../../../../styles/back-button.css';
import React, {memo} from 'react';
import {useNavigate} from 'react-router-dom';

export function BackButton() {
    const navigate = useNavigate();
    return (<>
            <button className={'backButton'} onClick={() => navigate('/')}>Back</button>
        </>);
}

export default memo(BackButton);