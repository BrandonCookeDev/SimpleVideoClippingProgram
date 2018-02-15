import React from 'react';
import ReactDOM from 'react-dom';

// main app
//import App from './App';
//import Timer from './Timer';
import YoutubeForm from './YoutubeForm'
import PlayerForm from './PlayerForm'
import TournamentForm from './TournamentForm'

//ReactDOM.render(<App />, document.getElementById('app'))
//ReactDOM.render(<Timer />, document.getElementById('timer'))
ReactDOM.render(<YoutubeForm />, document.getElementById('youtubeForm'))
ReactDOM.render(<PlayerForm />, document.getElementById('playerForm'))
ReactDOM.render(<TournamentForm />, document.getElementById('tournamentForm'))