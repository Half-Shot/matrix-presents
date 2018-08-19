import React, { Component } from 'react';
import './Slide.css';

class TitleSlide extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state: props.state,
      room: props.room,
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="slide title">
        <h1 className="title"> {this.props.name} </h1>
        <p>
            {this.props.topic}
        </p>
        <p>
          Authored by <a target="_new" href={"https://matrix.to/#/"+this.props.author}>{this.props.author}</a>
        </p>
      </div>
    );
  }
}

export default TitleSlide;
