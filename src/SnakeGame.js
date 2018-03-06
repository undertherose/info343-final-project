import React, { Component } from 'react';
import './App.css';

// Component representing the Snake game
// NOTE: This was written primarily myself, initially based off my Project 2: Art, and then
// refactored into a React version. 
// I DID initially look at https://github.com/tomocchino/react-snake/blob/master/build/snake.js
// to get the idea and initial base structure of creating a React version of Snake, but I ended up 
// moving away from that implementation (as you might notice if you look at the code).
export class SnakeGame extends Component {
    constructor(props){
        super(props);
        this.size = 20; // Size of snake and fruit

        // Responsive board height BUT requires page to be refreshed to update properly
        this.boardHeight = Math.floor(window.innerHeight / 2); 
        this.boardWidth = window.innerWidth;

        // Starting movement speed (lower is faster)
        this.defaultSpeed = 80;

        // Normalize the width and height to be a multiple of the size
        while (this.boardWidth % this.size !== 0) {
            this.boardWidth = this.boardWidth - 1;
        }
        while (this.boardHeight % this.size !== 0) {
            this.boardHeight = this.boardHeight - 1;
        }

        this.state = {
            gameOver: false,
            isGameStarted: false,
            speed: this.defaultSpeed,
            segments: [[this.getRandomY(), this.getRandomX()]],
            fruitLocation: [this.getRandomY(), this.getRandomX()],
            keypress: '',
            score: 0
        };
    }

    // Handle key presses
    logKey(e){
        if (this.state.keypress && !this.state.gameOver){
            this.setState({
                keypress: e.key,
                isGameStarted: true
            });
        } else if (['Enter'].includes(e.key)){
            clearInterval(this.state.intervalId);
            let newIntervalId = setInterval(() => {this.tick()}, this.defaultSpeed);
            this.setState({
                intervalId: newIntervalId,
                gameOver: '',
                speed: this.defaultSpeed,
                segments: this.state.segments,
                fruitLocation: this.state.fruitLocation,
                keypress: e.keypress || 'ArrowDown'
            });
        }
    }

    // Create new snake segment
    // Current bugs: - holding down a direction and then hitting a wall lets you go through
    newSegment() {
        let head = this.state.segments[0];
        // If the snake has at least 2 segments
        if (this.state.segments[1]) {
            // Prevent the snake from going in a direction opposite it is currently traveling
            // i.e. If the snake is moving up, it should not be able to move down over its body in one press
            let prev = this.state.segments[1];
            if (this.state.keypress === 'ArrowUp') {
                if (head[0] - this.size < 0) {
                    return [this.boardHeight - this.size, head[1]]
                }
                // Check if the snake is NOT currently moving down
                if (head[0] - prev[0] <= 0 || Math.abs(head[0] - prev[0]) > 200) {
                    return [head[0] - this.size, head[1]]
                } else {
                // Otherwise, keep moving down
                    return [head[0] + this.size, head[1]]
                }
            } else if (this.state.keypress === 'ArrowDown') {
                if (head[0] + this.size >= this.boardHeight) {
                    return [0, head[1]]
                }
                // Check if the snake is NOT currently moving up
                if (head[0] - prev[0] >= 0 || Math.abs(head[0] - prev[0]) > 200) {
                    return [head[0] + this.size, head[1]]
                // Otherwise, keep moving up
                } else {
                    this.setState({keypress:'ArrowUp'});
                    return [head[0] - this.size, head[1]]
                }
            } else if (this.state.keypress === 'ArrowRight') {
                if (head[1] + this.size >= this.boardWidth) {
                    return [head[0], 0];
                }
                // Check if the snake is NOT currently moving left
                if (head[1] - prev[1] >= 0 || Math.abs(head[1] - prev[1]) > 200) {
                    return [head[0], head[1] + this.size]
                // Otherwise, keep moving left
                } else {
                    return [head[0], head[1] - this.size]
                }
            } else {
                if (head[1] - this.size < 0) {
                    return [head[0], this.boardWidth - this.size]
                }
                // Check if the snake is NOT currently moving right
                if (head[1] - prev[1] <= 0 || Math.abs(head[1] - prev[1]) > 200) {
                    return [head[0], head[1] - this.size]
                // Otherwise, keep moving right
                } else {
                    return [head[0], head[1] + this.size]
                }
            }
        } else { 
        // Since the snake is just a single segment, it is free to move in any direction
            if (this.state.keypress === 'ArrowUp') {
                if (head[0] - this.size < 0) {
                    return [this.boardHeight - this.size, head[1]]
                } else {
                    return [head[0] - this.size, head[1]]
                }
            } else if (this.state.keypress === 'ArrowDown') {
                if (head[0] + this.size >= this.boardHeight) {
                    return [0, head[1]]
                } else {
                    return [head[0] + this.size, head[1]]
                }
            } else if (this.state.keypress === 'ArrowRight') {
                if (head[1] + this.size >= this.boardWidth) {
                    return [head[0], 0];
                } else {
                    return [head[0], head[1] + this.size]
                }
            } else {
                if (head[1] - this.size < 0) {
                    return [head[0], this.boardWidth - this.size]
                } else {
                    return [head[0], head[1] - this.size]
                }
            }    
        }
    }

    // Get a random X coordinate based on current board width
    getRandomX(){
        let x = Math.floor(Math.random() * this.boardWidth);
        // Normalize the width to be a multiple of the size
        while (x % this.size !== 0) {
            x = x - 1;
        }
        return x;
    }

    // Get a random Y coordinate based on current board height
    getRandomY() {
        let y = Math.floor(Math.random() * this.boardHeight);
        // Normalize the height to be a multiple of the size
        while (y % this.size !== 0) {
            y = y - 1;
        }
        return y;
    }
    
    // Control movement of snake at every interval tick
    tick(){
        // First check if the game is over
        if (this.hitBody()) {
            this.gameOver();
        }

        // Update the old segments with the new segment 
        let oldSegments = this.state.segments;
        oldSegments.unshift(this.newSegment());
        let newSegments = oldSegments;

        // Next check if snake ate a fruit
        if (this.ateFruit()) {
            // Increase speed a little after each fruit get
            let newSpeed = this.state.speed - 2;

            // The ID value returned by setInterval() is used as the parameter for the clearInterval() method
            clearInterval(this.state.intervalId);
            let newIntervalId = setInterval(() => {this.tick()}, newSpeed);

            // Update state to re-render fruit location + new segment, and update speed
            this.setState({
                speed: newSpeed,
                intervalId: newIntervalId,
                segments: newSegments,
                fruitLocation: [this.getRandomY(), this.getRandomX()]
            })
        // No action being done; just moving around
        } else {
            // Remove LAST segment (since we added a segment to the head)
            newSegments.pop();
            // Update state to re-render snake, simulating a single block movement
            this.setState({
                segments: newSegments
            })
        };
    }

    // Performs necessary tasks when game is over
    gameOver(){
        clearInterval(this.state.intervalId); // stop ticking
        this.setState({
            gameOver: 'You Lost! Score: ' + (this.state.segments.length - 1),
            segments: [[this.getRandomY(), this.getRandomX()]],
            fruitLocation: [this.getRandomY(), this.getRandomX()],
            score: this.state.segments.length - 1
        });
        this.props.updateScore(this.state.score);
    }

    // Check if snake hits its own segment
    hitBody(){
        let head = this.state.segments[0];
        let hitIt = false;
        // Iterate through each segment after the first (head) segment
        this.state.segments.slice(1).forEach((seg, i)=>{
            if ((head[1] === seg[1]) && (head[0] === seg[0])) {
                hitIt = true;
            }
        });
        return hitIt;
    }

    // Check if the snake ate the fruit
    ateFruit(){
        let head = this.state.segments[0];
        let fruit = this.state.fruitLocation;
        // Check if x,y location of snake head matches x,y location of fruit
        return (head[1] === fruit[1]) && (head[0] === fruit[0])
    }

    render() {
        // Render every segment of the snake
        let segments = this.state.segments.map((seg, i) =>
            <BodySegment key={'segment-' + i} size= {this.size} color= {'green'} location={seg} />
        );

        let boardDims = {
            height: this.boardHeight,
            width: this.boardWidth
        };

        return (
            <div className="snake-app" style={boardDims} onKeyDown={(e)=>{this.logKey(e)}} tabIndex='1' aria-labelledby="Snake game board">
            <h1>Score: {this.state.segments.length - 1}</h1>
            <p className="game-over">{this.state.gameOver}</p>
            {/* This BodySegment component represents current fruit on the board */}
            <BodySegment size={this.size} color={'red'} location={this.state.fruitLocation} />
            { segments }
            {!this.state.isGameStarted &&
                <div>
                    <p>In this version of Snek, the board is <em>borderless</em>!</p>
                    <p>Press <strong>ENTER</strong> to start playing! Use the <strong>ARROW</strong> keys to move.</p>
                    <p>Make sure to click anywhere on the board to toggle it active!</p>
                </div>
            }
            </div>
        );
    }
}

// Represents the (additional) body segments of the Snake AND the fruit
class BodySegment extends Component {
    render() {
        let divStyle = {
            'backgroundColor': this.props.color,
            'height': this.props.size,
            'width': this.props.size,
            'top': this.props.location[0],
            'left': this.props.location[1]
        }
    
        return(
            <div style={divStyle} className="body-segment"></div>
        )
    }
}

export default SnakeGame;