<template>
  <div class="slide-wrapper">
    <strong v-if="error">{{ error }}. This room cannot be viewed.</strong>
    <Slide v-else :eventId="slideEventId" :room="room"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Room } from "matrix-js-sdk";
import Slide from "./Slide.vue";

@Component
export default class SlideRoom extends Vue {
  private slideEventId: string|null = null;
  private slideEvents: string[];
  private error: string = "";
  @Prop() private room!: Room;

  private beforeMount() {
    const state = this.room.getLiveTimeline().getState("f");
    const t = state.getStateEvents("uk.half-shot.presents.slides", "");
    if (t === null) {
      this.error = "The required state for this room was not found";
      return;
    }
    const content = t.getContent();
    this.slideEvents = content.slides;
    this.slideEventId = content.slides[0];
    if (this.slideEvents === undefined || this.slideEvents.length === 0) {
      this.error = "No slides were given in the event.";
      return;
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
</style>
