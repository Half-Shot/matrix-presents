<template>
  <div class="slide-view-wrapper">  
    <SlideRoom v-if="knownRoom === true" :room="knownRoom"/>
    <p v-else-if="validRoomId === true">
      Would you like to join <code>{{ $route.params.roomId }} ?</code>
    </p> 
    <p v-else>
      <code>{{ $route.params.roomId }}</code> is not a valid room ID or alias.
    </p> 
  </div>
</template>

<script>
// @ is an alias to /src
import SlideRoom from '@/components/SlideRoom.vue'
import { getClient } from "@/util/matrix";
export default {
  name: "slides",
  components: {
    SlideRoom,
  },

  data: () => ({
    knownRoom: null,
    validRoomId: false,
  }),

  beforeMount: function() {
    const roomId = this.$route.params.roomId;
    // Is this a room we are in?
    const client = getClient();
    const existing = client.getRoom(roomId);
    if (existing) {
      this.knownRoom = existing;
      return;
    }

    // TODO: Lazy validation
    this.validRoomId = (roomId.startsWith("!") || roomId.startsWith("#")) && roomId.includes(":");
  }
}
</script>
