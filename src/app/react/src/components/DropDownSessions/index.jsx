import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../styles/dropdown-sessions.css';
import { SessionContext } from '../../contexts/sessionContext.js'; 
import { useContext } from 'react';

const Checkbox = ({ children, ...props }: JSX.IntrinsicElements['input']) => (<label style={{ marginRight: '1em' }}>
  <input type='checkbox' {...props} />
  {children}
</label>);



function DropSessionsDown() {
  const navigate = useNavigate();
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { sessionName, updateSessionName } = useContext(SessionContext);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/sessions/get_sessions')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSessions(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleNavigate = () => {
    console.log('Navigating to /home with sessionName:', selectedOption.label);
    updateSessionName(selectedOption.label);
    navigate('/home', { state: { sessionname: selectedOption.label } });
    }

  return (<>
    <Select
      className='basic-single'
      classNamePrefix='select'
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isRtl={isRtl}
      isSearchable={isSearchable}
      name='Sessions'
      options={sessions}
      onChange={(selectedOption) => {
        setSelectedOption(selectedOption);
        console.log(`Option selected:`, selectedOption);
      }}
    />

    <div
      style={{
        color: 'hsl(0, 0%, 40%)', display: 'inline-block', fontSize: 12, fontStyle: 'italic', marginTop: '1em',
      }}
    >
      <Checkbox
        checked={isClearable}
        onChange={() => setIsClearable((state) => !state)}
      >
        Clearable
      </Checkbox>
      <Checkbox
        checked={isSearchable}
        onChange={() => setIsSearchable((state) => !state)}
      >
        Searchable
      </Checkbox>
      <Checkbox
        checked={isDisabled}
        onChange={() => setIsDisabled((state) => !state)}
      >
        Disabled
      </Checkbox>
      <Checkbox
        checked={isLoading}
        onChange={() => setIsLoading((state) => !state)}
      >
        Loading
      </Checkbox>
      <Checkbox checked={isRtl} onChange={() => setIsRtl((state) => !state)}>
        RTL
      </Checkbox>
    </div>
    <div className='buttonContainer'>
      <button className='butt1class' onClick={() => handleNavigate()}>Submit</button>
    </div>
  </>);
}

export default DropSessionsDown;