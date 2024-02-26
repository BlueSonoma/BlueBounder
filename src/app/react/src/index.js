import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import '@xyflow/react/dist/style.css';
import App from './components/App';

export const HOST_URL = 'http://localhost:8000';


ReactDOM.render(<App />, document.getElementById('root'));
