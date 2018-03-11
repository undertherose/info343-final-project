import React, { Component } from 'react';
import {SnakeGame} from './SnakeGame';
import {SignIn} from './SignIn';
import {SignUp} from './SignUp';
import {Chat} from './Chat';
import {Scores} from './Scores';
import {UserAccount} from './UserAccount';
import { HashRouter as Router, Route, NavLink, Redirect} from "react-router-dom";
import './App.css';
import firebase from 'firebase';
import {Reacteroids} from './Games/Reacteroids-master/src/Reacteroids.js';
import {FifteenPuzzle} from './Games/FifteenPuzzle/Fifteen.js';

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
    updateScore(score, gameName) {
        this.setState({score: score});
        let entry = {};
        entry['name'] = this.state.user.displayName;
        entry['score'] = score;
        let ref = firebase.database().ref(gameName + 'Scores');
        ref.push(entry);
    }

    // Intended as a prop for components
    isLoggedOut() {
        this.setState({isLoggedIn: false});
    }

    render() {
        let accountStyles = {};
        if (this.state.user && this.state.user.photoURL) {
            accountStyles["paddingTop"] = 0;
            accountStyles["paddingBottom"] = 0;
        }
        return (
            <div className="container">
                <Router>
                    <div className="sub-container">
                        <nav>
                            <ul>
                                <li className="title"><h2>TITLE</h2></li>
                                <li><NavLink to="/home">Home</NavLink></li>
                                <li><NavLink to="/games">Games</NavLink></li>
                                <li><NavLink to="/play">Snake</NavLink></li>
                                <li><NavLink to="/scores">Scores</NavLink></li>
                                <li><NavLink to="/test">Reacteroids</NavLink></li>
                                <li><NavLink to="/fift">Fifteen Puzzle</NavLink></li>
                                <li className="signout-btn float-right">
                                    {
                                    this.state.isLoggedIn &&
                                    <button className="signout-btn btn btn-warning" onClick={() => this.handleSignOut()}>
                                        Sign Out
                                    </button>
                                    }
                                </li>
                                <li className="float-right mr-4">
                                    {
                                        this.state.isLoggedIn && this.state.user &&
                                        <NavLink style={accountStyles} to="/acc">
                                            {this.state.user.photoURL &&
                                                <img className="profile-pic" src={this.state.user.photoURL} alt="profile pic" />
                                            }
                                            {this.state.user.displayName}
                                        </NavLink>
                                    }
                                </li>
                                
                            </ul>
                        </nav>
                        <Route path="/acc" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <UserAccount {...routerProps} signoff={()=>this.handleSignOut()} isLoggedOut={() => this.isLoggedOut()} />
                            ) : (
                                <Redirect to="/signin" />
                            )
                        )} />
                        <Route path="/test" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Reacteroids updateScore = {(score, gameName) => this.updateScore(score, gameName)}/>
                            ) : (
                                <Redirect to="/signin" />
                            )
                        )} />
                        <Route path="/fift" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <FifteenPuzzle />
                            ) : (
                                <Redirect to="/signin" />
                            )
                        )} />
                        <Route path="/play" render={(routerProps) => (
                            this.state.isLoggedIn && this.state.user ? (
                                <div>
                                <Chat {...routerProps} name={this.state.user.displayName} />
                                <SnakeGame {...routerProps} updateScore = {(score, gameName) => this.updateScore(score, gameName)} />
                                </div>
                            ) : (
                                <SignIn {...routerProps} handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp} error={this.state.errorMessage}/>
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