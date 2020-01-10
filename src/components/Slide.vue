<template>
    <div class="slide">
        <div v-if="slideEv">
            <header :class="headerClass">
                <h1 v-if="slideEv.content.title !== undefined">{{ slideEv.content.title }}</h1>
                <h2 v-if="slideEv.content.subtitle !== undefined">{{ slideEv.content.subtitle }}</h2>
                <h3 v-if="author !== undefined && headerClass == 'title'">
                    {{ author }}
                    <img :src="authorAvatar" title="avatar" />
                </h3>
            </header>
            <main>
                <section class="column" v-for="(column, index) in columns" :key="index">
                    <SlideFragment v-for="eventId in column" :key="eventId" :eventId="eventId" :event="getEvent(eventId)" :room="room"/>
                </section>
            </main>
        </div>
        <strong v-else>Loading Slide</strong>
    </div>
</template>

<style lang="scss" scoped>

header.normal {
    margin-top: 3%;
    margin-left: 5%;
}

header.title {
    text-align: center;
    margin-top: 15%;
    margin-left: 5px;

    h1 {
        font-size: 72pt;
    }

    h2 {
        font-size: 40pt;
    }

    h3 {
        color: #777777;
        font-size: 30pt;
        img {
            border-radius: 50%;
        }
    }
}

header {
    h1 {
        color: #111111;
        font-size: 40pt;
    }
    h2 {
        color: #444444;
        font-size: 24pt;
    }
}

.slide {
    text-align: left;
    min-width: 90vw;
    min-height: 80vh;
}

main {
    display: flex;
    width: 90%;
    margin-left: 5%;
    height: 100%;
}

.column {
    margin-left: 45px;
    flex-basis: max-content;
}

.column:nth-child(1) {
    margin-left: 0;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SlideFragment from "./SlideFragment.vue";
import { Room } from 'matrix-js-sdk';

const SLIDE_EVENT_TYPE = "uk.half-shot.presents.slide";

interface SlideEvent {
    type: "uk.half-shot.presents.slide";
    sender: string;
    content: {
        title?: string;
        subtitle?: string;
        columns?: [
            string[],
        ],
    };
}

@Component
export default class Slide extends Vue {
    @Prop() private room!: Room;
    @Prop() private eventId!: string;
    private loading: boolean = true;
    private slideEv: SlideEvent|null = null;

    private get headerClass() {
        return this.slideEv!.content.columns ? "normal" : "title";
    }

    private get columns() {
        return this.slideEv!.content.columns || [];
    }

    private get author() {
        return this.room.getMember(this.slideEv!.sender).rawDisplayName;
    }

    private get authorAvatar() {
        return this.room.getMember(this.slideEv!.sender).getAvatarUrl(
            this.room._client.getHomeserverUrl(),
            64,
            64,
            "scale",
        );
    }

    private beforeMount() {
        console.log(`Loading ${this.eventId}`);
        this.getEvent(this.eventId).then((ev) => {
            console.log(`Loaded event`);
            this.slideEv = ev;
            console.log(this.slideEv)
        }).catch((ex) => {
            console.error("Error fetching event for slide:", ex);
            // Show an error
        }).finally(() => {
            this.loading = false;
        });
    }

    private async getEvent(eventId: string): Promise<SlideEvent> {
        // First, try to get it from the room
        const ev = await this.room._client.fetchRoomEvent(this.room.roomId, eventId);
        return ev as SlideEvent;
    }
}
Vue.component("Slide", Slide);
</script>