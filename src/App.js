import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slide from "./components/Slide.js";
import TitleSlide from "./components/TitleSlide.js";

import Matrix from "matrix-js-sdk";

const HOMESERVER = "https://matrix.half-shot.uk";
const ROOMID = window.location.hash.substr(1); //"!WKMMUrgQAslWVvnaeD:half-shot.uk";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      failure: null,
      accessToken: localStorage.getItem("access_token"),
      userId: localStorage.getItem("user_id"),
      slides: [],
      slideNumber: -1,
      presenterSlideNumber: - 1,
      lockedToPresenter: true,
      status: "",
    }
  }

  componentDidMount() {
    let client;
    let joinPromise;
    let room;
    if (this.state.accessToken) {
      client = Matrix.createClient({
        baseUrl: HOMESERVER,
        accessToken: this.state.accessToken,
        userId: this.state.userId,
        timelineSupport: true,
      });
      this.setState({status: "Joining room..."});
      joinPromise = client.joinRoom(ROOMID, {syncRoom: true});
    } else {
      client = Matrix.createClient({
        baseUrl: HOMESERVER,
        timelineSupport: true,
      });
      this.setState({status: "Registering as a guest..."});
      client.registerGuest().then((res) => {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("user_id", res.user_id);
        this.setState({accessToken: res.access_token, userId: res.user_id});
        this.componentDidMount();
      }).catch((err) => {
        console.log(err);
        this.setState({ready: false, failure: err, client});
      });
      return;
    }
    joinPromise.then((r) => {
      room = r
      this.setState({status: "Fetching room state..."});
      return client.roomState(room.roomId);
    }).then((state) => {
      const slides = state.find((ev) => ev.type === "uk.half-shot.slides").content.slides;
      const author = state.find((ev) => ev.type === "m.room.create").sender;
      const name = state.find((ev) => ev.type === "m.room.name").content.name;
      const topic = state.find((ev) => ev.type === "m.room.topic").content.topic;  
      this.setState({
        ready: true,
        client,
        room,
        state,
        slides,
        author,
        name,
        topic,
        authoritive: this.state.userId === author
      });

      if (!this.state.authoritive) {
        this.state.client.setGuest(true);
        this.state.client.on("RoomState.events", this.handleSlideChange.bind(this));
        this.state.client.startClient();
      }
      window.addEventListener("dblclick", this.advanceSlide.bind(this));
      window.addEventListener("keypress", (ev) => {
        if ([13,39,32].includes(ev.keyCode)) {
          this.advanceSlide();
        }
        if ([37, 8].includes(ev.keyCode)) {
          this.retreatSlide();
        }
      });

    });
    //client.publicRooms((err, data) => {
    //  console.log("Public Rooms: %s", JSON.stringify(data));
    //});
  }

  advanceSlide() {
    if (!this.state.authoritive && this.state.lockedToPresenter) {
      return;
    }
    if (this.state.slideNumber + 1 === this.state.slides.length) {
      return;
    }
    let slideNumber = this.state.slideNumber + 1;
    if (this.state.authoritive) {
      this.state.client.sendStateEvent(ROOMID, "uk.half-shot.currentslide", {
        current: slideNumber,
        previous: this.state.slideNumber,
      });
    }
    this.setState({
      slideNumber: slideNumber
    });
  }

  retreatSlide() {
    if (!this.state.authoritive && this.state.lockedToPresenter) {
      return;
    }
    if (this.state.slideNumber === -1) {
      return;
    }
    let slideNumber = this.state.slideNumber - 1;
    this.state.client.sendStateEvent(ROOMID, "uk.half-shot.currentslide", {
      current: slideNumber,
      previous: this.state.slideNumber,
    });
    this.setState({
      slideNumber: slideNumber
    });
  }

  handleSlideChange(ev) {
    const event = ev.event;
    if (event.room_id !== ROOMID) {
      return;
    }
    if (event.type !== "uk.half-shot.currentslide") {
      return;
    }
    let slideNumber = this.state.slideNumber;
    if (this.state.lockedToPresenter) {
      slideNumber = event.content.current;
    }
    this.setState({
      slideNumber,
      presenterSlideNumber: event.content.current,
    });
  }

  renderSlide() {
    console.log("Current slide is ", this.state.slideNumber);
    if (this.state.slideNumber === -1) {
      // Title page.
      return (<TitleSlide
        author={this.state.author}
        name={this.state.name}
        topic={this.state.topic}
        state={this.state.state}
        room={this.state.room}></TitleSlide>);
    }
    const eventId = this.state.slides[this.state.slideNumber];
    return (<Slide 
        key={eventId}
        client={this.state.client}
        room={this.state.room}
        eventId={eventId}>
      </Slide>);
  }

  ToggleLock() {
    let slideNumber = this.state.slideNumber;
    if (!this.state.lockedToPresenter) {
      slideNumber = this.state.presenterSlideNumber;
    }
    this.setState({
      lockedToPresenter: !this.state.lockedToPresenter,
      slideNumber
    });
  }

  render() {
    
    let content;

    if (this.state.ready === false) {
      if (this.state.failure !== null) {
        content = (<b> Failed to load slides. The server said: {this.state.failure.message}</b>);
      } else {
        content = (<b>Loading slides: {this.state.status}</b>);
      }
    } else {
      content = this.renderSlide();
    }

    const button = !this.state.authoritive ? (<button onClick={this.ToggleLock.bind(this)}> {this.state.lockedToPresenter ? "Unlock" : "Lock"} slides to presenters view </button>) : undefined;

    return (
      <div className="App">
        <header>
          <span> {this.state.name} - {this.state.author} </span>
          <span>{this.state.slideNumber + 1}</span>/<span>{this.state.slides.length}</span>
        </header>
        <main>
          { content }
        </main>
        <footer>
          { button }
        </footer>
      </div>
    );
  }
}

export default App;