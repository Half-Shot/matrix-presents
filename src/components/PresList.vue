<template>
  <div class="slide-list">
    <h2>Your Slides</h2>
    <ul>
        <li v-for="room in rooms" :key="room.roomId">
            <PresCard :roomId="room.roomId"/>
        </li>
        <p v-if=loading>
            Loading slides...
        </p>
        <p v-if=hasNoRooms>
            You are not currently subscribed to any Slides.
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

    private get hasNoRooms() {
        return !this.loading && this.rooms.length === 0;
    }

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
        const client = getClient();
        if (client.getSyncState() === null) {
            client.on("sync", this.onSync.bind(this));
        } else {
            this.regenerateRoomList();
        }
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
        this.loading = false;
    }

    private onSync(state: string, prevState: string, data: any) {
        if (state === "PREPARED" && prevState === null) {
            this.regenerateRoomList();
        }
    }
}

</script>

<style scoped lang="scss">
.button-set {
    list-style: none;
}

.button-set button {
    margin-bottom: 5px;
}
</style>
