<template>
  <div class="slide-list">
    <h2> Your Slides </h2>
    <ul>
        <li v-for="room in rooms" :key="room.roomId">
            <PresCard :roomId="room.roomId"/>
        </li>
        <p v-if=loading>
            Loading slides...
        </p>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getClient } from "@/util/matrix";

const STATE_KEY = "uk.half-shot.presents.slides";

@Component
export default class PresList extends Vue {
    private rooms: any[] = [];
    private loading: boolean = true;

    constructor() {
        // super({
        //     name: "PresList",
        //     components: {
        //         PresCard,
        //     }
        // })
        super();
    }

    public beforeDestroy() {
        const client = getClient();
        client.removeListener("sync", this.onSync);
    }

    public beforeMount() {
        console.log("beforeMount PresList");
        const client = getClient();
        client.on("sync", this.onSync.bind(this));
    }

    private regenerateRoomList() {
        const client = getClient();
        this.rooms = [];
        client.getRooms().forEach((room) => {
            const state = room.getLiveTimeline().getState("f");
            const t = state.getStateEvents(STATE_KEY, "");
            if (!t) {
                return;
            }
            this.rooms.push(room);
        });
        console.log("Finished generating room list");
        this.loading = false;
    }

    private onSync(state: string, prevState: string, data: any) {
        console.log("onSync", state, prevState, data);
        if (state === "PREPARED" && prevState === null) {
            this.regenerateRoomList();
        }
    }
}

</script>

<style scoped lang="scss">

</style>
