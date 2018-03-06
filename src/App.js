import React, { Component } from 'react';
import {SnakeGame} from './SnakeGame';
import {SignIn} from './SignIn';
import {SignUp} from './SignUp';
import {Chat} from './Chat';
import {Scores} from './Scores';
import { HashRouter as Router, Route, NavLink, Redirect} from "react-router-dom";
import './App.css';
import firebase from 'firebase';

class App extends Component {
    constructor(props){
        super(props);

        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);

        this.state = {
            isLoggedIn: false,
            score: 0
        };
    }

    componentDidMount() {
        // Use the firebase onAuthstateChanged method to watch for changes in authentication
        this.stopWatchingAuth = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    user: user,
                    errorMessage: '',
                    email: '',
                    password: '',
                    username: '',
                    isLoggedIn: true
                })
            } else { // User is signing out
                this.setState({
                    user: null
                })
            }
        })
    }

    // Handle changes to any input element
    handleChange(event) {
        let val = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = val;
        this.setState(change);
    }

    // Sign up with firebase authentication
    handleSignUp(email, pw, username) {
        firebase.auth().createUserWithEmailAndPassword(email, pw).then(user => {
            return user.updateProfile({
                displayName:username
            })
        }).then(user => {
            this.setState({user: firebase.auth().currentUser})
        }).catch(e => {
            this.setState({errorMessage:e.message})
        });
    }

    // Sign in with firebase authentication
    handleSignIn(email, pw) {
        firebase.auth().signInWithEmailAndPassword(email, pw).then(() => {
            this.setState({isLoggedIn:true});
        }).catch(e => {
            this.setState({errorMessage:e.message})
        })
    }

    // Sign out with firebase authentication
    handleSignOut() {
        this.setState({errorMessage: null, isLoggedIn: false, user: ''});
        firebase.auth().signOut()

    }

    // Update the score in the firebase database with the name and the score value
    updateScore(score) {
        this.setState({score: score});
        let entry = {};
        entry['name'] = this.state.user.displayName;
        entry['score'] = score;
        let ref = firebase.database().ref('scores');
        ref.push(entry);
    }

    render() {
        return (
            <div className="container">
                <Router>
                    <div className="sub-container">
                        <nav>
                            <ul>
                                <li className="title"><h2><span className="title1">Sne</span><span className="title2">k</span></h2></li>
                                <li><NavLink to="/play">Play Snek!</NavLink></li>
                                <li><NavLink to="/scores">Scores</NavLink></li>
                                <li><NavLink to="/chat">Chat</NavLink></li>
                                <li className="signout-btn float-right">
                                    {
                                    this.state.isLoggedIn &&
                                    <button className="signout-btn btn btn-warning" onClick={() => this.handleSignOut()}>
                                        Sign Out
                                    </button>
                                    }
                                </li>
                                
                            </ul>
                        </nav>
                        <Route path="/play" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <SnakeGame {...routerProps} updateScore = {(score) => this.updateScore(score)} />
                            ) : (
                                <SignIn {...routerProps} handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp}/>
                            )
                        )} />
                        <Route path="/chat" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Chat {...routerProps} name={this.state.user.displayName} />
                            ) : (
                                <SignIn {...routerProps} handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp}/>
                            )
                        )} />
                        <Route path="/signup" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <SnakeGame {...routerProps} updateScore = {(score) => this.updateScore(score)} />
                            ) : (
                                <SignUp {...routerProps} handleSignUp={this.handleSignUp}/>
                            )
                        )} />
                        <Route path="/scores" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Scores {...routerProps} />
                            ) : (
                                <SignIn {...routerProps} handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp}/>
                            )
                        )} />
                        <Route path="/signin" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Scores {...routerProps} />
                            ) : (
                                <SignIn {...routerProps} handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp}/>
                            )
                        )} />
                        <Route exact path="/" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <SnakeGame {...routerProps} updateScore = {(score) => this.updateScore(score)} />
                            ) : (
                                <Redirect to="/signin" />
                            )
                        )} />
                    </div>
                </Router>
                {this.state.errorMessage &&
                    <p className="alert alert-danger">{this.state.errorMessage}</p>
                }
            </div>
        );
    }
}
export default App;