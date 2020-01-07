<template>
  <div class="slide-view-wrapper">  
    <SlideRoom v-if="room !== null" :room="room"/>
    <strong v-else-if="syncing">Syncing</strong>
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
    validRoomId: true,
    syncing: true,
  }),
  beforeMount: function() {
    const roomId = this.$route.params.roomId;
    const client = getClient();
    const onSynced = () => {
      this.syncing = false;
      this.room = client.getRoom(roomId);
      this.$root.$data.sharedState.pageName = this.room ? this.room.name : roomId;
      console.log("Got room", this.room);

      if (!this.room) {
        // TODO: Lazy validation
        this.validRoomId = (roomId.startsWith("!") || roomId.startsWith("#")) && roomId.includes(":");
      }
    };

    if (client.getSyncState() !== null) {
        onSynced();
        return;
    }
    const f = (newState: string) => {
      if (newState === "PREPARED") {
        onSynced();
        client.removeListener("sync", f);
      }
    };
    client.on("sync", f);
  }
}
</script>
