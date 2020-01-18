<template>
  <div class="slide-list">
    <ul>
        <li v-for="room in rooms" :key="room.roomId">
            <SlideCard :room="room"/>
        </li>
        <p v-if="hasNoRooms && filterOwn">
            You have not created any slides yet.
        </p>
        <p v-else-if="hasNoRooms && !filterOwn ">
            You are not currently subscribed to any Slides.
        </p>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getClient } from "@/util/matrix";
import SlideCard from "@/components/SlideCard.vue";

const STATE_KEY = "uk.half-shot.presents.slides";

@Component({
    components: {
        SlideCard,
    }
})
export default class SlideList extends Vue {
    @Prop() private filterOwn!: boolean;
    private rooms: any[] = [];

    private get hasNoRooms() {
        return this.rooms.length === 0;
    }

    constructor() {
        super();
    }

    public beforeMount() {
        this.regenerateRoomList();
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
            console.log(t.getContent());
            const isOwnSlide = t.sender === client.getUserId();
            if (isOwnSlide && this.filterOwn || !isOwnSlide && !this.filterOwn) {
                this.rooms.push(room);
            }
        });
        console.log("Finished generating room list");
    }
}
</script>

<style scoped lang="scss">
ul {
    list-style: none;
    li {
        margin-bottom: 5px;
    }
}
</style>
