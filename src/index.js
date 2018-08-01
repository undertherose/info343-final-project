import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from 'firebase/app';
//import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAi2Rh-cKQAF5YFVpme7jJ6isx3ff1n60s",
    authDomain: "p4-francmit.firebaseapp.com",
    databaseURL: "https://p4-francmit.firebaseio.com",
    projectId: "p4-francmit",
    storageBucket: "",
    messagingSenderId: "945824936844"
};
firebase.initializeApp(config);


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
