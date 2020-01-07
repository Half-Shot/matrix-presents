<template>
    <div class="slide">
        <div v-if="slideEv">
            <header :class="headerClass">
                <h1 v-if="slideEv.content.title !== undefined">{{ slideEv.content.title }}</h1>
                <h2 v-if="slideEv.content.subtitle !== undefined">{{ slideEv.content.subtitle }}</h2>
            </header>
            <main>
                <section v-for="columnId in columns" :key="columnId">
                    <SlideFragment v-for="eventId of columns[columnId]" :key="eventId" :eventId="eventId" :room="room"/>
                </section>
            </main>
        </div>
        <strong v-else>Loading Slide</strong>
    </div>
</template>

<style lang="scss" scoped>

header.normal {
    margin: 5px 0px;
    margin-left: 5px;
}

header.title {
    text-align: center;
    margin-top: 15%;
    margin-left: 5px;
}

header {
    h1 {
        color: #333333;
        font-size: 24pt;
    }
    h2 {
        color: #444444;
        font-size: 18pt;
    }
}

.slide {
    text-align: left;
    border: 1px solid #000;
    min-width: 90vw;
    min-height: 80vh;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

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

    @Prop() private room!: any;
    @Prop() private eventId!: string;
    private loading: boolean = true;
    private slideEv: SlideEvent|null = null;

    private get headerClass() {
        return this.slideEv!.content.columns ? "normal" : "title";
    }

    private get columns() {
        return this.slideEv!.content.columns || [];
    }

    private beforeMount() {
        this.getEvent(this.eventId).then((ev) => {
            this.slideEv = ev;
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