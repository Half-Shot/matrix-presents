<template>
  <div>  
    <SlideRoom v-if="room" :room="room"/>
    <strong v-else-if="syncing">Syncing</strong>
    <strong v-else>An error occured. The room may not exist.</strong>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import SlideRoom from '@/components/SlideRoom.vue'
import Slide from '@/components/Slide.vue'
import { getClient } from "../util/matrix";
import { Room } from "matrix-js-sdk";

export default {
  name: "slides",
  components: {
    SlideRoom,
    Slide,
  },
  data: () => ({
    room: null as Room|null,
    syncing: true,
  }),
  beforeMount: function() {
    const roomId = this.$route.params.roomId;
    const client = getClient();
    const f = (newState: string) => {
      if (newState === "PREPARED") {
        this.syncing = false;
        this.room = client.getRoom(roomId);
        console.log("Got room", this.room);
        client.removeListener("sync", f);
      }
    };
    client.on("sync", f);
  },
}
</script>
