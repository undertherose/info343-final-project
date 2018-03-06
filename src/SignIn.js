import React, {Component} from 'react';
import {Link} from "react-router-dom";

// Component representing the Sign In page
export class SignIn extends Component {
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
                    <Link to="/play">
                    <button className="btn btn-success mr-2" onClick={() => this.props.handleSignIn(this.state.email, this.state.password)}>
                        Sign In!
                    </button>
                    </Link>
                    <Link to="/signup" className="float-right">Don't have an account?</Link>
                </div>
            </div>
        )
    }
}
