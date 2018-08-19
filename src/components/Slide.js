import React, { Component } from 'react';
import './Slide.css';
import Matrix from "matrix-js-sdk";

class Slide extends Component {

  constructor(props) {
    super(props);
    this.state = {
        content: null,
    };
  }

  componentDidMount() {
    console.log(`Loading slide for ${this.props.eventId}`);
    //Eurgh we need context or this won't work!
    this.props.client.getEventTimeline(this.props.room.getUnfilteredTimelineSet(), this.props.eventId).then((res) => {
        let content = res.getEvents().find((item) => item.event.event_id === this.props.eventId).event.content;
        this.setState({content});
    }).catch((err) => {
        console.error(err);
    });
  }

  render() {
    if (this.state.content === null) {
        return (
            <div className="slide">
                <b> Slide Loading... </b>
            </div>
        );
    }
    return (
      <div className="slide">
        <p dangerouslySetInnerHTML={{__html: this.state.content.formatted_body}}>
        </p>
      </div>
    );
  }
}

export default Slide;
