import React, { Component } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Scores } from './Scores';
import { UserAccount } from './UserAccount';
import { CommentSection } from './Comment.jsx';
import { HashRouter as Router, Route, NavLink, Redirect, Link } from "react-router-dom";
import { DropdownButton, NavDropdown, MenuItem } from 'react-bootstrap';
import './App.css';
import firebase from 'firebase';
import { SnakeGame } from './Games/SnakeGame/SnakeGame.js';
import { Reacteroids } from './Games/Reacteroids-master/src/Reacteroids.js';
import { FifteenPuzzle } from './Games/FifteenPuzzle/Fifteen.js';
import { Homepage } from './Homepage';
import { Helmet } from "react-helmet";

class App extends Component {
    constructor(props) {
        super(props);

        this.handleSignIn = this.handleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);

        this.state = {
            isLoggedIn: false,
            currentGame: '',
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
                displayName: username
            })
        }).then(user => {
            this.setState({ user: firebase.auth().currentUser })
        }).catch(e => {
            this.setState({ errorMessage: e.message })
        });
    }

    // Sign in with firebase authentication
    handleSignIn(email, pw) {
        firebase.auth().signInWithEmailAndPassword(email, pw).then(() => {
            this.setState({ isLoggedIn: true });
        }).catch(e => {
            this.setState({ errorMessage: e.message })
        })
    }

    // Sign out with firebase authentication
    handleSignOut() {
        this.setState({ errorMessage: null, isLoggedIn: false, currentGame: '', user: '' });
        firebase.auth().signOut()

    }

    // Update the score in the firebase database with the name and the score value
    updateScore(score, gameName) {
        if (this.state.user) {
            this.setState({ score: score });
            let entry = {};
            entry['name'] = this.state.user.displayName;
            entry['score'] = score;
            let ref = firebase.database().ref(gameName + 'Scores');
            let allRef = firebase.database().ref('AllScores');
            ref.push(entry);
            entry['gameName'] = gameName;
            allRef.push(entry);
        }
    }

    // Intended as a prop for components to know when a user is logged out
    isLoggedOut() {
        this.setState({ isLoggedIn: false });
    }

    // Intended as a prop for components to keep track of the current game being played
    updateCurrentGame(game) {
        this.setState({ currentGame: game });
    }

    render() {
        let accountStyles = {};
        if (this.state.user && this.state.user.photoURL) {
            accountStyles["paddingTop"] = 0;
            accountStyles["paddingBottom"] = 0;
        }
        return (
            <div className="container">
                <Helmet>
                    <style>{
                        'body { background-image: url(https://preview.ibb.co/jpheYS/background.png); background-repeat: no-repeat; background-size: cover}'
                    }</style>
                </Helmet>
                <Router>
                    <div className="sub-container">
                        <nav>
                            <li className="title"><h2>Arcode</h2></li>
                            <ul>

                                <li className="link"><NavLink to="/home">Home</NavLink></li>
                                <li className="link"><NavLink to="/snake">Snake</NavLink></li>
                                <li className="link"><NavLink to="/reacteroids">Reacteroids</NavLink></li>
                                <li className="link"><NavLink to="/fifteen">Fifteen Puzzle</NavLink></li>
                                <li className="link"><NavLink to="/scores">Scores</NavLink></li>
                                {/* <li className="link"><DropdownButton
                                    bsStyle="primary"
                                    title="Account"
                                    key={1}
                                    id={`dropdown-basic-1`}>
                                    <MenuItem eventKey="1.1">Action</MenuItem>
                                    <MenuItem eventKey="1.2">Another action</MenuItem>
                                    <MenuItem eventKey="1.3" active>Active Item</MenuItem>
                                    <MenuItem divider />
                                    <MenuItem eventKey="1.4">Separated link</MenuItem>
                                    </DropdownButton>
                                </li> */}
                                <li className="signout-btn float-right">
                                    {
                                        this.state.isLoggedIn && this.state.user &&
                                        <Link className="signout2" to="/signin">
                                            <button className="signout-btn btn-lg btn-warning" onClick={() => this.handleSignOut()}>
                                                Sign Out
                                        </button>
                                        </Link>
                                    }
                                </li>
                                <li className="acc-btn link float-right mr-4">
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
                                {/* <li className="link"><NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                                    <MenuItem className="link" eventKey={3.1} >Logged In As</MenuItem>
                                    <MenuItem divider />
                                    <MenuItem className="link" eventKey={3.2} onClick={() => this.handleSignOut()}>Log Out</MenuItem>                        
                                    </NavDropdown>
                                </li> */}

                            </ul>
                        </nav>
                        <Route path="/home" component={Homepage} />
                        <Route path="/acc" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <UserAccount {...routerProps} signoff={() => this.handleSignOut()} isLoggedOut={() => this.isLoggedOut()} />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                        <Route path="/reacteroids" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Reacteroids updateCurrentGame={(e) => this.updateCurrentGame(e)} updateScore={(score, gameName) => this.updateScore(score, gameName)} />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                        <Route path="/fifteen" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <FifteenPuzzle updateCurrentGame={(e) => this.updateCurrentGame(e)} updateScore={(score, gameName) => this.updateScore(score, gameName)} />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                        <Route path="/snake" render={(routerProps) => (
                            this.state.isLoggedIn && this.state.user ? (
                                <SnakeGame {...routerProps} updateCurrentGame={(e) => this.updateCurrentGame(e)} updateScore={(score, gameName) => this.updateScore(score, gameName)} />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                        <Route path="/signup" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Redirect to="/home" />
                            ) : (
                                    <SignUp {...routerProps} handleSignUp={this.handleSignUp} />
                                )
                        )} />
                        <Route path="/scores" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Scores {...routerProps} />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                        <Route path="/comments" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <CommentSection game={this.state.currentGame} />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                        <Route path="/signin" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Redirect to="/home" />
                            ) : (
                                    <SignIn {...routerProps} handleSignIn={this.handleSignIn} handleSignUp={this.handleSignUp} />
                                )
                        )} />
                        <Route exact path="/" render={(routerProps) => (
                            this.state.isLoggedIn ? (
                                <Redirect to="/home" />
                            ) : (
                                    <Redirect to="/signin" />
                                )
                        )} />
                    </div>
                </Router>
                {this.state.errorMessage &&
                    <p>{this.state.errorMessage}</p>
                }
            </div>
        );
    }
}

export default App;