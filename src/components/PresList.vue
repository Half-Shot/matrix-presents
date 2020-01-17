<template>
  <div class="slide-list">
    <ul>
        <li v-for="room in rooms" :key="room.roomId">
            <div class="card">
                <a :href="`/slides/${encodeURIComponent(room.roomId)}`">{{ room.name }}</a>
            </div>
        </li>
        <p v-if=hasNoRooms>
            You are not currently subscribed to any Slides.
        </p>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getClient } from "@/util/matrix";

const STATE_KEY = "uk.half-shot.presents.slides";

@Component
export default class PresList extends Vue {
    @Prop() private filterOwn!: boolean;
    private rooms: any[] = [];

    private get hasNoRooms() {
        return this.rooms.length === 0;
    }

    constructor() {
        super();
    }

    public beforeMount() {
        console.log("beforeMount PresList");
        this.regenerateRoomList();
    }

    private regenerateRoomList() {
        const client = getClient();
        this.rooms = [];
        console.log(client.getRooms());
        client.getRooms().forEach((room) => {
            const state = room.getLiveTimeline().getState("f");
            const t = state.getStateEvents(STATE_KEY, "");
            console.log(t);
            if (!t) {
                return;
            }
            this.rooms.push(room);
        });
        console.log("Finished generating room list");
    }
}
</script>

<style scoped lang="scss">
ul {
    list-style: none;
}
.card {

}
</style>
