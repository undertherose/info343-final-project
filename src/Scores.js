
import React, { Component } from 'react';
import firebase from 'firebase';
import  { RadialBarChart, RadialBar } from 'recharts';
import * as d3 from 'd3';

// Component representing the scores page
export class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreData: [],
            game: "Snake"
        }
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

    // Changes the game data to be shown
    changeGame(name) {
        this.setState({game: name});   
    }

    render() {
        return (
            <div className="scores-container">
                <div className="dropdown">                   
                    <select className="form-control" aria-labelledby="dropdownMenuButton" onChange={(event) => {
                        this.changeGame(event.target.value);
                    }}>
                        <option value="Snake" className="dropdown-item" >Snake</option>
                        <option value="Reacteroids" className="dropdown-item">Reacteroids</option>
                        <option value="Fifteenboxes"className="dropdown-item">Fifteen Boxes</option>
                    </select>
                </div>
                <div className="charts">
                    {this.state.game === "Snake" && <SnakeScores snapshotToArray={(snapshot) => this.snapshotToArray(snapshot)}/>}
                    {this.state.game === "Reacteroids" && <ReacteroidsScores snapshotToArray={(snapshot) => this.snapshotToArray(snapshot)}/>}
                </div>
            </div>
        )
    }
}


// Component representing data for Snake game
class SnakeScores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreData: []
        }
    }
    // On mount, pull from the "scores" table in the database
    componentDidMount() {
        let ref = firebase.database().ref('SnakeScores');
        let db = ref.orderByChild("score").limitToLast(10);
        db.on('value', (snapshot => {
            let dat = this.props.snapshotToArray(snapshot);
            this.setState({ scoreData: dat });
        }));
    }

    render() {
         let radialData = d3.nest()
         .key(function(d) { return d.name;})
         .rollup(function(v) { return d3.sum(v, function (d) { return d.score;})})
         .entries(this.state.scoreData);
         console.log(radialData);     
        return (
            <div className="charts-container">
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
                                    <tr key={'item-' + i}>
                                        <td>{i + 1}</td>
                                        <td>{Object.entries(d)[0][1]}</td>
                                        <td>{Object.entries(d)[1][1]}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <RadialBarChart width={730} height={250} innerRadius="10%" outerRadius="80%" data={radialData} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='uv' />
                </RadialBarChart>
            </div>
        )
    }
}

// Component representing data for Reacteroids game
class ReacteroidsScores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreData: []
        }
    }
    // On mount, pull from the "scores" table in the database
    componentDidMount() {
        let ref = firebase.database().ref('ReacteroidsScores');
        let db = ref.orderByChild("score").limitToLast(10);
        db.on('value', (snapshot => {
            let dat = this.props.snapshotToArray(snapshot);
            this.setState({ scoreData: dat });
        }));
    }

    render() {
        return (
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
                                <tr key={'item-' + i}>
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