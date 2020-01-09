<template>
    <div class="fragment">
        <img v-if="!!image" :src="image" :title="!text"/>
        <p v-else-if="!!text"> {{ text }} </p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Room } from 'matrix-js-sdk';

@Component
export default class SlideFragment extends Vue {
    @Prop() private eventId!: string;
    @Prop() private room!: Room;
    @Prop() private event!: any;

    private image: string|null = null;
    private text: string|null = null;

    public async beforeMount() {
        const eventData = await this.event;
        if (eventData.content.msgtype === "m.image") {
            this.image = this.room._client.mxcUrlToHttp(eventData.content.url);
        }
        if (eventData.content.body) {
            this.text = eventData.content.body;
        }
        console.log("event", eventData);
    }
}

console.log("Registered");

Vue.component("SlideFragment", SlideFragment);
</script>

<style>

p {
    font-size: 24pt;
}

</style>