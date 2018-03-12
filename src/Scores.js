import React, { Component } from 'react';
import firebase from 'firebase';
<<<<<<< HEAD
import  { RadialBarChart, RadialBar, Cell, Tooltip, Legend } from 'recharts';
=======
import  { RadialBarChart, RadialBar, Label, LabelList } from 'recharts';
>>>>>>> 8b83d813b4b627d6aee5cd225e833d59a6bdbf37
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
                        <option value="FifteenPuzzle"className="dropdown-item">Fifteen Puzzle</option>
                    </select>
                </div>
                <div className="charts">
                    {this.state.game === "Snake" && <Charts name="SnakeScores" snapshotToArray={(snapshot) => this.snapshotToArray(snapshot)}/>}
                    {this.state.game === "Reacteroids" && <Charts name="ReacteroidsScores" snapshotToArray={(snapshot) => this.snapshotToArray(snapshot)}/>}
                    {this.state.game === "Reacteroids" && <Charts name="FifteenPuzzleScores" snapshotToArray={(snapshot) => this.snapshotToArray(snapshot)}/>}
                </div>
            </div>
        )
    }
}


// Component representing data for Snake game
class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreData: [],
            user: ""
        }
    }
    // On mount, pull from the "scores" table in the database
    componentDidMount() {
        let ref = firebase.database().ref(this.props.name);
        let db = ref.orderByChild("score").limitToLast(10);
        db.on('value', (snapshot => {
            let dat = this.props.snapshotToArray(snapshot);
            this.setState({ scoreData: dat });
        }));
        let name = firebase.auth().currentUser.displayName;
        this.setState({user: name});
    }

    getUserData(array) {
        array.forEach((d) => {
            if (d.key === this.state.user) {
                d.fill = "#E14658";
            } else {
                d.fill = "#C0B3A0";
            }
        })
    }

    render() {
         let radialData = d3.nest()
         .key(function(d) { return d.name;})
         .rollup(function(v) { return d3.mean(v, function (d) { return d.score;})})
         .entries(this.state.scoreData);
<<<<<<< HEAD
         console.log(radialData); 

         const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
         
=======
         console.log(radialData);  
         this.getUserData(radialData);   
>>>>>>> 8b83d813b4b627d6aee5cd225e833d59a6bdbf37
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
<<<<<<< HEAD
                <RadialBarChart width={730} height={250} innerRadius="10%" outerRadius="80%" data={radialData} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey='value'>
                        {
                            radialData.map((entry, index) => {
                                const color = entry.value > 4000 ? COLORS[0] : COLORS[1];
                                return <Cell fill={color} />;
                            })
                        }
                    </RadialBar>
                    <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                    <Tooltip />
=======
                <RadialBarChart width={750} height={750} innerRadius="10%" outerRadius="80%" data={radialData} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} background clockWise={true} dataKey='value' >
                    <LabelList dataKey="key" fill="#EEE"/>
                    </RadialBar>
>>>>>>> 8b83d813b4b627d6aee5cd225e833d59a6bdbf37
                </RadialBarChart>
            </div>
        )
    }
<<<<<<< HEAD
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

class FifteenPuzzleScores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scoreData: []
        }
    }
    // On mount, pull from the "scores" table in the database
    componentDidMount() {
        let ref = firebase.database().ref('FifteenPuzzleScores');
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
=======
>>>>>>> 8b83d813b4b627d6aee5cd225e833d59a6bdbf37
}