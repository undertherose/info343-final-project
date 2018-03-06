
import React, { Component } from 'react';
import firebase from 'firebase';

// Component representing the scores page
export class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreData: []
        }
    }

    // On mount, pull from the "scores" table in the database
    componentDidMount() {
        let ref = firebase.database().ref('scores');
        let db = ref.orderByChild("score").limitToLast(10);
        db.on('value', (snapshot => {
            let dat = this.snapshotToArray(snapshot);
            this.setState({scoreData: dat})
        }))
    }

    // Convert snapshot into array for iteration during render
    snapshotToArray(snapshot) {
        let returnArr = [];
        snapshot.forEach(childSnapshot => {
            let item = childSnapshot.val();
            item.key = childSnapshot.key;
            // To get descending scores, need to unshift instead of push to reverse order
            returnArr.unshift(item);
        });
        return returnArr;
    }

    render() {
        return(
            <table>
                <tbody>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                    {
                        this.state.scoreData.map((d, i) => {
                            return (
                            <tr key={'item-'+i}>
                                <td>{i + 1}</td>
                                <td>{Object.entries(d)[0][1]}</td>
                                <td>{Object.entries(d)[1][1]}</td>
                            </tr>
                        );
                        })
                    }
                </tbody>
            </table>
        )
    }
}