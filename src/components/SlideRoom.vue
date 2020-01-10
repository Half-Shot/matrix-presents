<template>
  <div class="slide-wrapper">
    <strong :title="MODE_TITLE[mode]" class="mode" @click="switchMode"> Mode: {{ mode }} </strong>
    <strong v-if="error">{{ error }}. This room cannot be viewed.</strong>
    <Slide v-else :eventId="slideEventId" :key="slideEventId" :room="room"/>
    <strong>{{ slideEventIndex + 1 }} / {{ slideEvents.length }}</strong>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { Room } from "matrix-js-sdk";
import Slide from "./Slide.vue";

@Component
export default class SlideRoom extends Vue {
  private slideEventIndex: number = 0;
  private slideEvents: string[] = [];
  private error: string|null = null;
  private mode: "presenter"|"viewer"|"unlocked" = "viewer";
  @Prop() private room!: Room;

  private readonly MODE_TITLE = {
    viewer: "Locked to the presenters view",
    unlocked: "Unlocked to explore the presentation",
    presenter: "Present to other people in viewer mode",
  };

  private beforeMount() {
    const state = this.room.getLiveTimeline().getState("f");
    const t = state.getStateEvents("uk.half-shot.presents.slides", "");
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

    this.room._client.on("event", this.onEvent);

    window.addEventListener("keydown", this.onKeyPress.bind(this));
  }

  private advanceSlide() {
    if (this.mode === "viewer") {
      return;
    }
    if (this.slideEvents.length - 1 === this.slideEventIndex) {
      return; // Cannot advance
    }
    this.slideEventIndex += 1;
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
    console.log(`Going back to${this.slideEventIndex} ${this.slideEventId}`);

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
    // Can this user be a presenter?
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
    const canMovePosition = state.maySendStateEvent(
      "uk.half-shot.presents.position", this.$root.$data.sharedState.userId,
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
    if (event.event.type !== "uk.half-shot.presents.position" || event.event.state_key === undefined) {
      return;
    }
    console.log("New position from presenter", event.event.content.event_id);
    this.slideEventIndex = this.slideEvents.indexOf(event.event.content.event_id);
  }

  private beforeUnmount() {
    window.removeEventListener("keypress", this.onKeyPress);
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
</style>
