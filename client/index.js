import React from 'react';
import ReactDOM from 'react-dom';

// main app
import App from './App';
import Timer from './Timer';
import VideoForm from './VideoForm'
import PlayerForm from './PlayerForm'

ReactDOM.render(<App />, document.getElementById('app'))
ReactDOM.render(<Timer />, document.getElementById('timer'))
ReactDOM.render(<VideoForm />, document.getElementById('videoForm'))
ReactDOM.render(<PlayerForm />, document.getElementById('playerForm'))