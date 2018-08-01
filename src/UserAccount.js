import React, {Component} from 'react';
import firebase from 'firebase';

//component representing the user account page
export class UserAccount extends Component {
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

    // Update the name and/or the avatar of the user profile
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

    // Update the email of the user
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

    // Send an email to verify email address to the user
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

    // Deletes the user account
    deleteAcc() {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
        }).catch(function(error) {
            // An error happened.
        });
        // After deleting account, need to set this to false 
        this.props.isLoggedOut();
    }

    render() {
        let user = firebase.auth().currentUser;


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