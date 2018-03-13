import React, { Component } from 'react';
import {Link} from "react-router-dom";

// Component representing the Sign Up page
export class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
        };
    }

    // Handle changes to any input element
    handleChange(event) {
        let val = event.target.value;
        let field = event.target.name;
        let change = {};
        change[field] = val;
        this.setState(change);
    }

    render() {
        return(
            <div className="auth">
                <div className="form-group col-md-4 mx-auto">
                    <label>Email:</label>
                    <input className="form-control"
                        name="email"
                        value={this.state.email}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group col-md-4 mx-auto">
                    <label>Password:</label>
                    <input type="password" className="form-control"
                        name="password"
                        value={this.state.password}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group col-md-4 mx-auto">
                    <label>Username:</label>
                    <input className="form-control"
                        name="username"
                        value={this.state.username}
                        onChange={(event) => { this.handleChange(event) }}
                    />
                </div>

                <div className="form-group col-md-4 mx-auto">
                    <Link to="/play">
                    <button className="btn btn-primary mr-2 float-left" onClick={() => this.props.handleSignUp(this.state.email, this.state.password, this.state.username)}>
                        Sign Up
                     </button>
                    </Link>
                    <Link to="/signin" className="float-right">Already have an account?</Link>
                </div>
            </div>
        )
    }    
}