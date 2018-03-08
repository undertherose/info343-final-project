import React, { Component } from 'react';
import firebase from 'firebase';

// Component representing the Chat page
export class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
        this.onAddMessage = this.onAddMessage.bind(this);
    }
  
    // On mount, pull from the "messages" table in the firebase db, then add listener to check new messages
    componentDidMount() {
        let messagesRef = firebase.database().ref('messages').orderByKey().limitToLast(100);
        // Upon a new message, append the message to the state
        messagesRef.on('child_added', snapshot => {
            let message = {
                text: snapshot.val(),
                id: snapshot.key
            };
            let prevMessages = this.state.messages;
            prevMessages.unshift(message);
            this.setState({messages: prevMessages});
        });
    }
  
    // Push new messages to the firebase "messages" table
    onAddMessage(event) {
        event.preventDefault();
        firebase.database().ref('messages').push({
            text:this.input.value,
            name: this.props.name,
            timestamp:firebase.database.ServerValue.TIMESTAMP
        });
        this.input.value = ''; // reset input element
    }
  
    render() {
        return (
            <form className="comment-section" onSubmit={this.onAddMessage}>
            <p>Leave a comment or chat with other players...</p>
            <input className="form-control col-md-7 d-inline" type="text" ref={node => this.input = node}/>
            <input className="btn btn-primary col-md-5" type="submit" value="Send Message"/>
            <ul>
            <hr />
            {
                this.state.messages.map(message =>
                    <div key={'div-' + message.id}>
                        <li><strong>{message.text.name}</strong><span className="timeStamp">{' ' + (new Date(message.text.timestamp)).toString().split(' ')[4]}</span></li>
                        <dl>
                            <li>{message.text.text}</li>
                        </dl>
                        <hr />
                    </div>
                )
            }
            </ul>
            </form>
        );
    }
}