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
                                <li className="title"><h2>TITLE</h2></li>
                                <li><NavLink to="/home">Home</NavLink></li>
                                <li><NavLink to="/games">Games</NavLink></li>
                                <li><NavLink to="/play">Snake</NavLink></li>
                                <li><NavLink to="/scores">Scores</NavLink></li>
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
                                        <NavLink to="/acc">{this.state.user.displayName}</NavLink>
                                    }
                                </li>
                                
                            </ul>
                        </nav>
                        <Route path="/acc" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <UserAccount {...routerProps} signoff={()=>this.handleSignOut()}/>
                            ) : (
                                <Redirect to="/signin" />
                            )
                        )} />
                        <Route path="/play" render={(routerProps) => (
                            this.state.isLoggedIn && this.state.user ? (
                                <div>
                                <Chat {...routerProps} name={this.state.user.displayName} />
                                <SnakeGame {...routerProps} updateScore = {(score) => this.updateScore(score)} />
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

class UserAccount extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            username: '',
            photoURL: '',
        };
        this.updateEmail = this.updateEmail.bind(this);
    }

    // Handle changes to any input element
    handleChange(event) {
        let val = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = val;
        this.setState(change);
    }

    updateProfile(name, url) {
        let user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name,
            photoURL: url
        }).then(function() {
            // Update successful.
            window.location.reload(false);
        }).catch(function(error) {
            // An error happened.
        });
    }

    updateEmail(email) {
        var user = firebase.auth().currentUser;
        let current = this;
        user.updateEmail(email).then(function() {
            // Update successful.
            console.log('email updated successfully');
        }).catch(function(error) {
            // An error happened.
            current.props.signoff();
        });
    }

    sendEmailVerification() {
        var user = firebase.auth().currentUser;

        user.sendEmailVerification().then(function() {
            // Email sent.
        }).catch(function(error) {
            // An error happened.
        });
    }

    // INSECURE WAY OF HANDLING PW CHANGE
    updatePassword(pw) {
        var user = firebase.auth().currentUser;
        var newPassword = pw;

        user.updatePassword(newPassword).then(function() {
            // Update successful.
        }).catch(function(error) {
            // An error happened.
        });

    }

    deleteAcc() {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
            // User deleted.
        }).catch(function(error) {
            // An error happened.
        });

    }

    reauthenticate() {
        var user = firebase.auth().currentUser;
        var credential;

        // Prompt the user to re-provide their sign-in credentials
        user.reauthenticateWithCredential(credential).then(function() {
            // User re-authenticated.
        }).catch(function(error) {
            // An error happened.
        });
    }

    render() {
        let user = firebase.auth().currentUser;
            // name = user.displayName;
            // email = user.email;
            // photoUrl = user.photoURL;
            // emailVerified = user.emailVerified;
            // uid = user.uid;

        return (
            <div>
                <br />
                <br />
                <br />
                <p>Your email: {user.email}</p>
                <div className="form-group col-md-4 mx-auto">
                    <p>Your display name: {user.displayName}</p>
                    <label>Change Name:</label>
                    <input className="form-control" name="username" onChange={event => this.handleChange(event)} value={this.state.username} />

                    <label>Change Avatar:</label>
                    <input className="form-control" name="photoURL" onChange={event => this.handleChange(event)} value={this.state.photoURL} />

                    <button className="btn btn-primary" onClick={() => this.updateProfile(this.state.username, this.state.photoURL)}>Update profile</button>
                </div>

                <div className="form-group col-md-4 mx-auto">
                    <label>Email:</label>
                    <input className="form-control" name="email" onChange={event => this.handleChange(event)} value={this.state.email} />

                    <button className="btn btn-primary" onClick={() => this.updateEmail(this.state.email)}>Update email address</button>
                </div>
            </div>
        );
    }
}
export default App;