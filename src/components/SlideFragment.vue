<template>
    <div class="fragment">
        <img v-if="!!image" :src="image" :title="!text"/>
        <p ref=html class="html" v-else-if="!!textHtml" v-html="textHtml"></p>
        <p class="plain" v-else-if="!!text"> {{ text }} </p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Room } from "matrix-js-sdk";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";


@Component
export default class SlideFragment extends Vue {
    @Prop() private eventId!: string;
    @Prop() private room!: Room;
    @Prop() private event!: any;

    private image: string|null = null;
    private text: string|null = null;
    private textHtml: string|null = null;

    public async beforeMount() {
        const eventData = await this.event;
        if (eventData.content.msgtype === "m.image") {
            this.image = this.room._client.mxcUrlToHttp(eventData.content.url);
        }
        if (eventData.content.formatted_body) {
            this.textHtml = eventData.content.formatted_body;
        }
        if (eventData.content.body) {
            this.text = eventData.content.body;
        }
    }

    private updated() {
        if (this.$refs.html) {
            (this.$refs.html as Element).querySelectorAll("code").forEach((codeEl) => {
                hljs.highlightBlock(codeEl);
            });
        }
    }
}

console.log("Registered");

Vue.component("SlideFragment", SlideFragment);
</script>

<style lang="scss">

p.plain {
    font-size: 3vh;
}

code {
    font-size: 2vh;
}

.fragment > .html {
    h1 {
        font-size: 48pt;
    }

    h2 {
        font-size: 38pt;
    }
}

</style>