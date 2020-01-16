<template>
  <div class="slide-view-wrapper">  
    <SlideRoom v-if="room !== null" :room="room"/>
    <p v-else-if="validRoomId === true">
      Would you like to join <code>{{ $route.params.roomId }} ?</code>
    </p> 
    <p v-else>
      <code>{{ $route.params.roomId }}</code> is not a valid room ID or alias.
    </p>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import SlideFragment from "@/components/SlideFragment.vue";
import SlideRoom from "@/components/SlideRoom.vue";
import Slide from "@/components/Slide.vue";
import TableTennis from "@/components/TableTennis.vue";

import { getClient } from "../util/matrix";
import { Room } from "matrix-js-sdk";
import Component from "vue-class-component";
import Vue from "vue";

@Component({
  components: {
    SlideRoom,
    Slide,
    SlideFragment,
    TableTennis,
  },
})
export default class Slides extends Vue {
  private room: Room|null = null;
  private validRoomId = true;

  public beforeMount() {
    const roomId = this.$route.params.roomId;
    const client = getClient();
    this.room = client.getRoom(roomId);
    this.$root.$data.sharedState.pageName = this.room ? this.room.name : roomId;
    console.log("Got room", this.room);

    if (!this.room) {
      // TODO: Lazy validation
      this.validRoomId = (roomId.startsWith("!") || roomId.startsWith("#")) && roomId.includes(":");
    }
  }
}
</script>
