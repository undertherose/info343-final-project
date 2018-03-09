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

    // Intended as a prop for components
    isLoggedOut() {
        this.setState({isLoggedIn: false});
    }

    render() {
        let accountStyles = {};
        if (this.state.user && this.state.user.photoURL) {
            accountStyles["padding-top"] = 0;
            accountStyles["padding-bottom"] = 0;
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
        this.updatePassword = this.updatePassword.bind(this);
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
        let prof = {};
        if (name || url) {
            if (name) {
                prof['displayName'] = name;
            }
            if (url) {
                prof['photoURL'] = url;
            }
        }
        user.updateProfile(prof).then(function() {
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
            window.location.reload(false);
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

    // Shouldn't need to encrypt the password in the frontend before sending it to the backend as 
    // far as there is an HTTPS connection
    updatePassword(pw) {
        var user = firebase.auth().currentUser;
        let current = this;

        var newPassword = pw;
        user.updatePassword(newPassword).then(function() {
            // Update successful.
            window.location.reload(false);
        }).catch(function(error) {
            // An error happened.
            current.props.signoff();
        });

    }

    deleteAcc() {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
        }).catch(function(error) {
            // An error happened.
        });
        // After deleting account, need to set this to false 
        this.props.isLoggedOut();
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
                <div className="form-group col-md-6 mx-auto mb-4">
                    <p>Your current display name: {user.displayName}</p>
                    <label>Change Name:</label>
                    <input className="form-control" name="username" onChange={event => this.handleChange(event)} value={this.state.username} />

                    <label>Change Avatar:</label>
                    <input className="form-control" placeholder="Enter a URL..." name="photoURL" onChange={event => this.handleChange(event)} value={this.state.photoURL} />

                    <button className="btn btn-primary" onClick={() => this.updateProfile(this.state.username, this.state.photoURL)}>Update profile</button>
                </div>
                <div className="form-group col-md-6 mx-auto mb-4">
                    <p>Your current email: {user.email}</p>
                    <label>Change Email:</label>
                    <input className="form-control" name="email" onChange={event => this.handleChange(event)} value={this.state.email} />

                    <button className="btn btn-primary" onClick={() => this.updateEmail(this.state.email)}>Update email address</button>
                </div>

                <div className="form-group col-md-6 mx-auto mb-4">
                    <label>Change password:</label>
                    <input className="form-control" type="password" name="password" onChange={event => this.handleChange(event)} value={this.state.password} />

                    <button className="btn btn-primary" onClick={() => this.updatePassword(this.state.password)}>Update password</button>
                </div>

                <div className="form-group mx-auto">
                    <button className="btn btn-danger float-right" onClick={() => {if (window.confirm('Are you sure you want to delete your account?')) this.deleteAcc()}}>Delete Account</button>
                </div>
            </div>
        );
    }
}
export default App;