import React from 'react';
import '../../styles/start.css';
import { useNavigate } from 'react-router-dom';

function Start() {
  const navigate = useNavigate();

  return (<div>
    {/* <div id="title-bar">
                <h1 id="title">Blue Segment</h1>
                <div id="window-controls">
                    <button className="window-control-button" id="close-button">x</button>
                    <button className="window-control-button" id="minimize-button">-</button>
                    <button className="window-control-button" id="maximize-button">+</button>
                </div>
            </div> */}

    <div className='div1class'>
      <p>Welcome!</p>
      <p>What would you like to do?</p>
      <div className='div2class'>
        <button className='butt1class' onClick={() => navigate('/newSession')}>New session</button>
        <button className='butt1class' onClick={() => navigate('/oldSessions')}>Old session</button>
      </div>
    </div>
  </div>);
}

export default Start;