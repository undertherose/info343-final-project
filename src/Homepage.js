import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Carousel, CarouselItem } from 'react-bootstrap';
import background from "./imgs/background.png";
import slide01 from "./imgs/slide01.png";
import slide02 from "./imgs/slide02.png";
import slide03 from "./imgs/slide03.png";
import snake from "./imgs/snake.png";
import fifteenpuzzle from "./imgs/fifteenpuzzle.png";
import reacteroids from "./imgs/reacteroids.png";


export class Homepage extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="homepage">
                <div className="intro">
                
                <ControlledCarousel />
                </div>
                <CardList />
                
            </div>
        )

    }
}

export class ControlledCarousel extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleSelect = this.handleSelect.bind(this);
  
      this.state = {
        index: 0,
        direction: null
      };
    }
  
    handleSelect(selectedIndex, e) {
      /*alert(`selected=${selectedIndex}, direction=${e.direction}`);*/
      this.setState({
        index: selectedIndex,
        direction: e.direction
      });
    }
  
    render() {
      const { index, direction } = this.state;
  
      return (
        <Carousel
          activeIndex={index}
          direction={direction}
          onSelect={this.handleSelect}
        >
          <Carousel.Item>
            <img width={900} height={500} alt="900x500" src={ slide01 } />
          </Carousel.Item>
          <Carousel.Item>
            <img width={900} height={500} alt="900x500" src={ slide02 } />
          </Carousel.Item>
          <Carousel.Item>
            <img width={900} height={500} alt="900x500" src={ slide03 } />
          </Carousel.Item>
        </Carousel>
      );
    }
  }
  

export class GameCard extends Component{
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    /*likeItem() {
        let cardRef = firebase.database().ref('cards/' + this.props.info.key + '/likes');
        cardRef.transaction((likes) => likes +1);
    }*/

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }
    
    render() {
        return (
            <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
                <div className="card w-100 text-center mb-4">
                    <img className="card-img-top" src={ this.props.info.img } alt="Card image cap"/>
                    <div className="card-body">
                        <h3 className="card-title">{this.props.info.title}</h3>
                        <p className="card-text">{this.props.info.text}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export class CardList extends Component{
    constructor(props) {
        super(props);
    }


    render() {
        let games = [{title: "Reacteroids", img: reacteroids, text: "..."},
        {title: "Snake", img: snake, text: "..."},
        {title: "Fifteen Puzzle", img: fifteenpuzzle, text: "..."}];
        return (
            <div className="cardlist row">
                {games.map((d, i) => {
                    return <GameCard key={"item-" + i} info={ d } />
                })}
            </div>
        )
    }
}