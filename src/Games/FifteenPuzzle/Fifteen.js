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
            disabled: true,
            won: false
        }
    }

    //function that returns x position of tile
    getX(tile) {
        return parseInt(tile.style.left);
    }

    //function that returns y position of tile
    getY(tile) {
        return parseInt(tile.style.top);
    }

    //function that shuffles the board 
    shuffle() {
        this.setState({
            disabled: false,
            won: false
        });
        let squares = document.querySelectorAll("#puzzlearea div");
        for (let i = 0; i < squares.length; i++) {
            squares[i].classList.remove("solved");
        }
        for (let i = 0; i < 1; i++) {
            let neighbors = this.getNeighbors();
            let randPick = neighbors[(Math.floor(Math.random() * neighbors.length))];
            if (randPick) {
                randPick.click();
            }
        }
        this.setState({ moves: 0 }); //reset moves after clicking
    }

    //function that determines if tile is able to move using x and y position. Returns boolean
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

    //function that returns an array of tiles that are next to the empty square
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

    //function that takes an event e and determines
    //whether or not to highlight a tile if it's moveable
    onHover(e) {
        let x = this.getX(e.target);
        let y = this.getY(e.target);
        if (this.canMove(x, y)) {
            e.target.classList.add("highlight");
        }
    }

    //function that handles when a user "unhovers" from a tile
    unHover(tile) {
        tile.classList.remove("highlight");
    }

    //function that checks if the game is over and alerts the player if they have won
    //changes the styling of the background so only the picture appears
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
        if (bool && !this.state.disabled) {
            this.props.updateScore(this.state.moves + 1, "FifteenPuzzle");
            this.setState({
                won: bool,
                disabled: true
            });
            for (let i = 0; i < squares.length; i++) {
                squares[i].classList.add("solved");
            }
        }
    }

    //function that takes event (e) that handles when a user wants to move
    //a tile
    moveTile(e) {
        //only moveable if game hasn't been won
        if (!e.target.classList.contains("solved")) { 
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
                if (!this.state.disabled) {
                    this.checkGame();
                }
            }
        }
    }

    //function that generates generates an array of squares and returns that array
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

    //function that handles event (e) when user changes picture in background of puzzle
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

    //renders puzzle
    render() {
        return (
            <div>
                <div id="puzzlearea">{
                    this.makeSquares()
                }
                </div>
                {this.state.won && <div className="won">{"YOU WON IN " + (this.state.disabled && this.state.moves) + " MOVES!!!"}</div>}
                <button className="btn btn btn-warning" onClick={() => this.shuffle()}>Shuffle</button>
                <label htmlFor="files" className="btn btn-primary">Change Image</label>
                <input id="files" type="file" style={{ visibility: "hidden" }} onChange={(e) => this.changePic(e)}></input>
            </div>
        );
    }
}