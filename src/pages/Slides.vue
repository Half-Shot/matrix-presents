<template>
  <div class="slide-view-wrapper">  
    <template>
      <div v-if=error>
        <h2> Failed to join room </h2>
        <p> {{error}} </p>
      </div>
    </template>
    <SlideRoom v-if="room !== null && joined" :room="room"/>
    <p v-else-if="validRoomId === true">
      You are attempting to view <code>{{ $route.params.roomId }}</code>?
      <button @click="joinRoom">Join Room</button>
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
  private error: string|null = null;
  private validRoomId = true;

  private roomId!: string;

  private get joined() {
      return this.room?.getMyMembership() === "join";
  }

  public async beforeMount() {
    this.roomId = this.$route.params.roomId;
    await this.loadRoomInfo();
  }

  private async beforeDestroy() {
    const client = getClient();
    client.removeListener("Room.name", this.onRoomName);
  }

  private async mounted() {
    if (this.$root.$data.sharedState.isGuest) {
      console.log("Autojoining since user is a guest");
      await this.joinRoom();
    }
  }

  private async joinRoom() {
    this.error = null;
    const client = getClient();
    try {
      const res = await client.joinRoom(this.$route.params.roomId);
      this.roomId = res.room_id || this.$route.params.roomId;
      client.once("Room", (room: Room) => {
        if (this.roomId === room.roomId) {
          this.loadRoomInfo(room);
        }
      });
      // XXX: Slightly evil
    } catch (ex) {
      console.error("Failed to join room", ex);
      this.error = ex.message;
    }
  }

  private async loadRoomInfo(room?: Room) {
    if (!this.room) {
      // TODO: Lazy validation
      this.validRoomId = (this.roomId.startsWith("!") || this.roomId.startsWith("#")) && this.roomId.includes(":");
    }
    if (!this.validRoomId) {
      console.log("RoomID isn't valid");
      return;
    }

    const client = getClient();
    if (this.roomId.startsWith("#")) {
      try {
        this.roomId = (await client.getRoomIdForAlias(this.roomId)).room_id;
      } catch (ex) {
        this.error = "Could not resolve alias";
        return;
      }
    }
    this.room = room || client.getRoom(this.roomId);
    this.$root.$data.sharedState.pageName = this.room ? this.room.name : this.roomId;
    console.log("Got room", this.room);
    if (this.room) {
      client.on("Room.name", this.onRoomName.bind(this));
    }
  }

  private async onRoomName(room: Room) {
    if (room.roomId === this.roomId) {
      this.$root.$data.sharedState.pageName = room.name;
    }
  }
}
</script>
