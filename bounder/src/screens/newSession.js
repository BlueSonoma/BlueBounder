import React, {useState} from 'react';
import '../styles/new-session.css'
import {useNavigate} from 'react-router-dom';
import BackButton from '../components/additional-components/buttons/BackButton';

function App() {
    const [sessionName, setSessionName] = useState('');
    const [csvFilePath, setCsvFilePath] = useState('');
    const navigate = useNavigate();

    const handleSubmission = (event) => {
        if (sessionName === '') {
            alert('Please enter a session name');
            return;
        }
        event.preventDefault();
        console.log(sessionName);
        console.log(csvFilePath);
        var formData = new FormData();
        formData.append('csvFilePath', csvFilePath);
        formData.append('sessionName', sessionName);
        fetch('http://localhost:8000/create_starter_images', {
            method: 'POST', body: formData,
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });
        navigate('/home');
    }


    return (<div>
            <head>
                <title>Blue Segment</title>
            </head>
            <body>
            <BackButton/>
            <div class="centered">
                <div class="form_div">

                    <form class="formClass" onSubmit={handleSubmission}>
                        <input class="inputClass" type="text" name="sessionName" id="sessionName"
                               placeholder="Session Name" onChange={(e) => setSessionName(e.target.value)}/>
                        <input class="inputClass" type="text" name="CSV" id="csvFilePath"
                               placeholder="CSV File path (optional)" onChange={(e) => setCsvFilePath(e.target.value)}/>
                        <button class="butt1new">enter</button>
                    </form>

                </div>
            </div>


            </body>
        </div>);
}

export default App;