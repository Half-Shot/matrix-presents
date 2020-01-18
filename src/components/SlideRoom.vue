<template>
  <div class="slide-wrapper" ref="slide" >
    <div class="tools" v-if=!isFullscreen>
      <strong>{{ slideEventIndex + 1 }} / {{ slideEvents.length }}</strong> |
      <strong id="modechanger" :title="MODE_TITLE[mode]" class="mode" @click="switchMode">{{ mode }}</strong> |
      <a @click="goFullscreen">{{ isFullscreen ? "Exit" : "Go"  }} Fullscreen</a>
    </div>
    <strong v-if="error">{{ error }}. This room cannot be viewed.</strong>
    <Slide v-else :eventId="slideEventId" :key="slideEventId" :room="room"/>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { Room } from "matrix-js-sdk";
import { SlidesEventType, SlidesEvent } from "../models/SlidesEvent";
import { PositionEventType, PositionEvent } from "../models/PositionEvent";
import Slide from "./Slide.vue";

@Component
export default class SlideRoom extends Vue {
  private slideEventIndex = -1;
  private slideEvents: string[] = [];
  private error: string|null = null;
  private mode: "presenter"|"viewer"|"unlocked" = "viewer";
  @Prop() private room!: Room;

  private isFullscreen = false;

  private readonly MODE_TITLE = {
    viewer: "Locked to the presenters view",
    unlocked: "Unlocked to explore the presentation",
    presenter: "Present to other people in viewer mode",
  };

  private beforeMount() {

    const state = this.room.getLiveTimeline().getState("f");
    const t = state.getStateEvents(SlidesEventType, "") as SlidesEvent;
    if (t === null) {
      this.error = "The required state for this room was not found";
      return;
    }
    const content = t.getContent();
    this.slideEvents = content.slides;
    if (this.slideEvents === undefined || this.slideEvents.length === 0) {
      this.error = "No slides have been created";
      return;
    }

    // Try to get the eventId from the query parameters
    if (this.$route.params.eventId) {
      this.slideEventIndex = this.slideEvents.indexOf(this.$route.params.eventId);
    }

    if (this.slideEventIndex === -1) {
      this.slideEventIndex = 0;
    }

    this.room._client.on("event", this.onEvent);

    window.addEventListener("keydown", this.onKeyPress.bind(this));
    window.addEventListener("fullscreenchange", () => this.isFullscreen = !this.isFullscreen);
  }

  private advanceSlide() {
    if (this.mode === "viewer") {
      return;
    }
    if (this.slideEvents.length - 1 === this.slideEventIndex) {
      return; // Cannot advance
    }
    this.slideEventIndex += 1;
    this.updateEvent();
    console.log(`Advancing slide to ${this.slideEventIndex} ${this.slideEventId}`);

    if (this.mode === "presenter") {
      this.room._client.sendStateEvent(
        this.room.roomId, "uk.half-shot.presents.position",
        {
          event_id: this.slideEventId,
        },
        this.room._client.getUserId(),
      );
    }
  }

  private previousSlide() {
    if (this.mode === "viewer") {
      return;
    }
    if (this.slideEventIndex < 1) {
      return; // Cannot advance
    }
    this.slideEventIndex -= 1;
    this.updateEvent();
    console.log(`Going back to${this.slideEventIndex} ${this.slideEventId}`);

    if (this.mode === "presenter") {
      this.room._client.sendStateEvent(
        this.room.roomId, PositionEventType,
        {
          event_id: this.slideEventId,
        },
        this.room._client.getUserId(),
      );
    }
  }

  private get slideEventId() {
    return this.slideEvents[this.slideEventIndex] || null;
  }

  private onKeyPress(ev: KeyboardEvent) {
    ev.preventDefault();
    if (ev.keyCode === 39) { // Right
      this.advanceSlide();
    } else if (ev.keyCode === 37) { // Left
      this.previousSlide();
    }
  }

  private switchMode() {
    if (this.mode === "viewer") {
      this.mode = "unlocked";
      return;
    }
    if (this.mode === "presenter") {
      this.mode = "viewer";
      return;
    }
    // unlocked
    const state = this.room.getLiveTimeline().getState("f");
    // Can this user be a presenter?
    const canMovePosition = state.maySendStateEvent(
      PositionEventType, this.$root.$data.sharedState.userId,
    );
    if (canMovePosition) {
      this.mode = "presenter";
    } else {
      this.mode = "viewer";
    }
  }

  private onEvent(event: any) {
    if (this.mode !== "viewer") {
      return;
    }
    if (event.event.room_id !== this.room.roomId) {
      return;
    }
    if (event.event.type !== PositionEventType || event.event.state_key === undefined) {
      return;
    }
    console.log("New position from presenter", event.event.content.event_id);
    this.updateEvent();
    this.slideEventIndex = this.slideEvents.indexOf(event.event.content.event_id);
    if (this.slideEventIndex === -1) {
      console.error(`Could not find ${event.event.content.event_id} in show`);
    }
  }

  private async goFullscreen() {
    if (this.isFullscreen) {
      document.exitFullscreen();
      this.isFullscreen = false;
      return;
    }
    await (this.$refs.slide as Element).requestFullscreen();
  }

  private beforeUnmount() {
    window.removeEventListener("keypress", this.onKeyPress);
  }

  private updateEvent(index?: number) {
    this.$router.push(`/slides/${this.room.roomId}/${this.slideEventId}`);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.mode {
  text-align: left;
}

.slide-wrapper {
  background: white;
}

#modechanger {
  text-decoration: underline;
}
</style>
