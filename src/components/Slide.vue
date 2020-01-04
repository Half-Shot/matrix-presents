<template>
    <div class="slide">
        <header>
            <h1 v-if="slideEv.content.title !== undefined">{{ slideEv.content.title }}</h1>
            <h2 v-if="slideEv.content.subtitle !== undefined">{{ slideEv.content.subtitle }}</h2>
        </header>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

const SLIDE_EVENT_TYPE = "uk.half-shot.presents.slide";

interface SlideEvent {
    type: "uk.half-shot.presents.slide",
    content: {
        title?: string;
        subtitle?: string;
        columns: [
            string[], // event_ids
        ],
    }
}

@Component
export default class Slide extends Vue {
    private slideEv: SlideEvent = {
        type: SLIDE_EVENT_TYPE,
        content: {
            columns: [[]],
            title: "Example Slide Title",
            subtitle: "Example Slide Subtitle",
        }
    };
}
</script>