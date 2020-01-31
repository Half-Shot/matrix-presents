<template>
  <div class="slide-wrapper" ref="slide">
    <SlideTools
      v-if=!isFullscreen
      :room=room
      :isFullscreen=isFullscreen
      :slideIndex=slideEventIndex
      :slideCount=slideEvents.length
      :internalMode="mode"
      :canEdit="false"
      :onChangeMode="(m) => mode = m"
      :onChangeFullscreen="goFullscreen"
      :slideEventId="slideEventId"
    />
    <strong v-if="error">{{ error }}. This room cannot be viewed.</strong>
    <template v-else>
      <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" class="qrCode"/>
      <div class="inner-wrapper">
        <Slide :class="oldSlideClass" v-if="animating" :eventId="oldSlideEventId" :room="room"/>
        <Slide v-if="!animating" :editing="mode === 'editor'" :eventId="slideEventId" :key="slideEventId" :room="room"/>
        <Slide :class="newSlideClass" v-if="animating" :eventId="slideEventId" :room="room"/>
      </div>
      <ul class="emojitron">
        <li v-for="(count, emoji) in currentEmojiSet" :key="emoji"> 
          <div v-emoji >
            {{ emoji }}
            <span>{{ count }}</span>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style lang="scss">
.inner-wrapper {
  position: relative;
}
.inner-wrapper > * {
  z-index: 5;
  float: left;
  position: absolute;
  top: 0;
  left: 0;
  animation-duration: 0.75s;
  width: 100%;
}

.qrCode {
  float: right;
  width: 200px;
}

.emojitron {
  text-align: right;
  display: block;
  width: 25vw;
  height: 5vh;
  position: absolute;
  bottom: 5vh;
  right: 5vh;

  .emoji {
      height: 36pt;
  }

  span {
    display: inline-block;
    position: absolute;
    bottom: 0px;
    right: 5px;
    color: red;
    font-weight: 800;
    font-size: 18pt;
  }

  > li > div {
    position: relative;
  }
}
</style>

<script lang="ts">

import { Component, Prop, Vue } from "vue-property-decorator";
import { Room, MatrixEvent } from "matrix-js-sdk";
import { SlidesEventType } from "../models/SlidesEvent";
import { PositionEventType } from "../models/PositionEvent";
import Slide from "./Slide.vue";
import SlideTools from "./Slides/SlideTools.vue";
import ReactionButton from "./Slides/ReactionButton.vue";
import { getMatrixEvent } from '../util/matrix';
import QRCode from "qrcode";
import "../../node_modules/animate.css/animate.css"

@Component({
  components: {
    Slide,
    SlideTools,
    ReactionButton,
  }
})
export default class SlideRoom extends Vue {
  private animating: "forwards"|"backwards"|null = null;
  private slideEventIndex = -1;
  private slideEvents: string[] = [];
  private error: string|null = null;
  private mode: "presenter"|"viewer"|"unlocked"|"editor" = "viewer";
  private emojiSet: {[roomId: string]: string[]} = { };
  private currentEmojiSet: any = {};
  @Prop() private room!: Room;

  private isFullscreen = false;

  private qrCodeDataUrl: string = "";

  private get slideEmojis() {
    const allEmojis = this.emojiSet[this.slideEventId] || []; 
    const map = {};
    allEmojis.forEach((e) => {
      map[e] = (map[e] || 0) + 1;
    });
    return map;
  }

  private get oldSlideClass() {
    if (this.animating === "forwards") {
      return "fadeOutLeft";
    } else if (this.animating === "backwards") {
      return "fadeOutRight";
    }
    return "";
  }

  private get newSlideClass() {
    if (this.animating === "forwards") {
      return "fadeInRight";
    } else if (this.animating === "backwards") {
      return "fadeInLeft";
    }
  }

  private get canEdit() {
    const state = this.room.currentState;
    return state && state.maySendEvent("uk.half-shot.presents.slide", this.room.myUserId)
     && state.maySendStateEvent("uk.half-shot.presents.slides", this.room.myUserId);
  }

  private beforeMount() {
    const stateEvent = this.room.currentState.getStateEvents(SlidesEventType, "");
    if (stateEvent === null) {
      this.error = "The required state for this room was not found";
      return;
    }
    if (stateEvent instanceof Array) {
      // This cannot happen, but to make types happy...
      return;
    }
    this.updateSlideSet(stateEvent);

    this.room._client.on("event", this.onEvent.bind(this));

    window.addEventListener("keydown", this.onKeyPress.bind(this));
    window.addEventListener("fullscreenchange", () => this.isFullscreen = !this.isFullscreen);
    
    this.updateEvent();
    
    this.bufferSlides().then(() => {
      console.log("Finished buffering slides");
    });
  }

  private beforeUnmount() {
      this.room._client.removeEventListener("event");
      window.removeEventListener("keydown");
      window.removeEventListener("fullscreenchange");
  }

  private async advanceSlide() {
    if (this.mode === "viewer") {
      return;
    }
    if (this.slideEvents.length - 1 === this.slideEventIndex) {
      return; // Cannot advance
    }
    this.slideEventIndex += 1;
    console.log(`Advancing slide to ${this.slideEventIndex} ${this.slideEventId}`);
    this.animating = "forwards";
    setTimeout(() => {
      this.animating = null;
      this.updateEvent();
    }, 750);
    await this.sendUpdatedPosition();
  }

  private async previousSlide() {
    if (this.mode === "viewer") {
      return;
    }
    if (this.slideEventIndex < 1) {
      return; // Cannot advance
    }
    this.slideEventIndex -= 1;
    this.updateEvent();
    console.log(`Going back to${this.slideEventIndex} ${this.slideEventId}`);
    this.animating = "backwards";
    setTimeout(() => {
      this.animating = null;
      this.updateEvent();
    }, 750);
    await this.sendUpdatedPosition();
  }

  private async sendUpdatedPosition() {
    if (this.mode === "presenter") {
      try {
        const ev = await this.room._client.sendStateEvent(
          this.room.roomId, "uk.half-shot.presents.position",
          {
            event_id: this.slideEventId,
          },
          this.room._client.getUserId(),
        );
        console.log(ev);
      } catch (ex) {
        console.error("Failed to change position", ex);
      }
    }
  }

  private get slideEventId() {
    return this.slideEvents[this.slideEventIndex] || null;
  }

  private get oldSlideEventId() {
    if (this.animating === "forwards") {
      return this.slideEvents[this.slideEventIndex - 1] || null;
    } else if (this.animating === "backwards") {
      return this.slideEvents[this.slideEventIndex + 1] || null;
    }
    return this.slideEventId;
  }

  private async onKeyPress(ev: KeyboardEvent) {
    ev.preventDefault();
    if (ev.keyCode === 39 || ev.keyCode === 34) { // Right
      await this.advanceSlide();
    } else if (ev.keyCode === 37 || ev.keyCode === 33) { // Left
      await this.previousSlide();
    }
  }

  private toggleEditor() {
    this.mode = this.mode === "editor" ? "unlocked" : "editor";
  }

  private onEvent(event: MatrixEvent) {
  
    if (event.getType() === "m.reaction") {
      // Possibly a reaction.
      const content = event.getContent()["m.relates_to"];
      if (content && content.rel_type === "m.annotation" && content.key && content.key.length <= 2) { //XXX: Lazy emoji detection
        if (!this.emojiSet[this.slideEventId]) {
          this.emojiSet[this.slideEventId] = [];
        }
        this.emojiSet[this.slideEventId].push(content.key);
        this.currentEmojiSet = this.slideEmojis;
        console.log("Got a reaction of:", content.key);
    
        // HACK FILTER ROOM
        this.currentEmojiSet[content.key] = (this.currentEmojiSet[content.key] || 0) + 1;
        console.log("Setting current emoji");
      } 
    }

    if (event.getRoomId() !== this.room.roomId) {
      return;
    }
    if (event.getType() === PositionEventType && event.isState()) {
      if (this.mode !== "viewer") {
        return;
      }
      const eventId = event.getContent().event_id;
      console.log("New position from presenter", eventId);
      this.updateEvent();
      this.slideEventIndex = this.slideEvents.indexOf(eventId);
      if (this.slideEventIndex === -1) {
        console.error(`Could not find ${eventId} in show`);
      }
    }
    if (event.getType() === SlidesEventType && event.getStateKey() === "") {
      return this.updateSlideSet(event);
    }
  }
  
  private updateSlideSet(t: MatrixEvent) {
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
  }

  private async goFullscreen() {
    if (this.isFullscreen) {
      document.exitFullscreen();
      this.isFullscreen = false;
      return;
    }
    await (this.$refs.slide as Element).requestFullscreen();
  }

  private updateEvent() {
    console.log("Update event:", this.slideEventId);
    this.currentEmojiSet = this.slideEmojis;
    
    if (!this.emojiSet[this.room.roomId]) {
      this.room._client._mpAggregations(this.room.roomId, this.slideEventId, "m.annotation", "m.reaction").then(({ chunk }) => {
        const set = [];
        chunk.forEach((eSet) => {
          for (let index = 0; index < eSet.count; index++) {
            set.push(eSet.key);
          }
        });
        this.emojiSet[this.slideEventId] = set;
        console.log("Weee:", this.emojiSet[this.slideEventId]);
      }).catch((ex) => {
        console.log("Could not get reactions:", ex);
      });
    }
    const url = `/slides/${this.room.roomId}`;
    QRCode.toDataURL(`https://presents.half-shot.uk${url}`).then((dataURL: string) => {
      this.qrCodeDataUrl = dataURL;
    }).catch((err) => {
      console.error(`data error:`, err);
    });
    this.$router.push(`${url}/${this.slideEventId}`);
  }

  private async bufferSlides() {
    // This will pull in events for all slides in the background.
    for (const slideId of this.slideEvents) {
      const slideEv = await getMatrixEvent(this.room.roomId, slideId);
      for (const fragmentColumn of slideEv.getContent().columns || []) {
        for (const fragmentId of fragmentColumn) {
          await getMatrixEvent(this.room.roomId, fragmentId);
        }
      }
    }
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
