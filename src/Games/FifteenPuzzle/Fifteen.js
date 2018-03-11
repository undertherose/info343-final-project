import React, { Component } from 'react';
import firebase from 'firebase';
import './Fifteen.css';


export class FifteenPuzzle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            xCord: 600,
            yCord: 600,
            size: 200,
            rows: 4,
            moves: 0,
            disabled: true
        }
    }

    getX(tile) {
        return parseInt(tile.style.left);
    }

    getY(tile) {
        return parseInt(tile.style.top);
    }

    shuffle() {
        this.setState({
            disabled: false
        })
        for (let i = 0; i < 1000; i++) {
            let neighbors = this.getNeighbors();
            let randPick = neighbors[(Math.floor(Math.random() * neighbors.length))];
            if (randPick) {

                randPick.click();
            }
        }
    }

    canMove(x, y) {
        if ((y == this.state.yCord - this.state.size || y == this.state.yCord + this.state.size)
            && x == this.state.xCord) {
            return true;
        } else if ((x == this.state.xCord - this.state.size || x == this.state.xCord + this.state.size)
            && y == this.state.yCord) {
            return true;
        }
        return false;
    }

    getNeighbors() {
        let squares = document.querySelectorAll("#puzzlearea div");
        let result = [];
        for (let i = 0; i < squares.length; i++) {
            let x = this.getX(squares[i]);
            let y = this.getY(squares[i]);
            if (this.canMove(x, y)) {
                result.push(squares[i]);
            }
        }
        return result;
    }

    onHover(e) {
        let x = this.getX(e.target);
        let y = this.getY(e.target);
        if (this.canMove(x, y)) {
            e.target.classList.add("highlight");
        }
    }

    unHover(tile) {
        tile.classList.remove("highlight");
    }

    checkGame() {
        let squares = document.querySelectorAll("#puzzlearea div");
        let bool = true;
        for (let i = 0; i < squares.length; i++) {
            let correct = squares[i].id.split(" ");
            if ((correct[0] !== this.getX(squares[i]).toString()) ||
                correct[1] !== this.getY(squares[i]).toString()) {
                bool = false;
            }
        }
        if (bool) {
            alert("you won in " + this.state.moves + " moves!");
        }
    }

    moveTile(e) {
        let x = this.getX(e.target);
        let y = this.getY(e.target);
        if (this.canMove(x, y)) {
            e.target.style.left = this.state.xCord + "px";
            e.target.style.top = this.state.yCord + "px";
            this.setState({
                xCord: this.state.xCord = x,
                yCord: this.state.yCord = y,
                moves: this.state.moves + 1
            })
        }
    }

    makeSquares() {
        let squares = [];
        for (let i = 0; i < (this.state.rows * this.state.rows - 1); i++) {
            let x = (i % this.state.rows) * this.state.size;
            let y = Math.floor(i / this.state.rows) * this.state.size;

            squares.push(
                <div key={i} id={x + " " + y} className="square" onMouseOut={(e) => this.unHover(e.target)}
                    onMouseOver={(e) => this.onHover(e)} onClick={(e) => this.moveTile(e)}
                    style={{
                        backgroundPosition: -x + "px " + -y + "px",
                        left: x + "px", top: y + "px"
                    }}>
                    {i + 1}
                </div>
            );
        }
        return squares;
    }

    changePic(e) {
        let squares = document.querySelectorAll("#puzzlearea div");
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files[0]);
            var reader = new FileReader();
            reader.onload = function (e) {
                for (let i = 0; i < squares.length; i++) {
                    squares[i].style.backgroundImage = `url(${e.target.result})`
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    }

    render() {
        let squares = this.makeSquares();
        return (<div>
            <div id="puzzlearea">{
                squares
            }
            </div>
            <button className="btn btn btn-warning" onClick={() => this.shuffle()}>Shuffle</button>
            {!this.state.disabled &&
                <button className="btn btn btn-primary" onClick={() => this.checkGame()}>Check</button>
            }
            <input type="file" onChange={(e) => this.changePic(e)}></input>
        </div>
        );
    }
}