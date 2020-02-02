<template>
    <div :class="`fragment ${isSolo ? 'solo' : ''}`">
        <img class="image" v-if="!!image" :src="image" :title="!text"/>
        <p v-emoji ref=html class="html" v-else-if="!!textHtml" v-html="textHtml"></p>
        <p v-emoji class="plain" v-else-if="!!text" v-html="text"> </p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Room, MatrixEvent } from "matrix-js-sdk";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";


@Component
export default class SlideFragment extends Vue {
    @Prop() private eventId!: string;
    @Prop() private room!: Room;
    @Prop() private event!: Promise<MatrixEvent>;
    @Prop() private isSolo!: boolean;

    private image: string|null = null;
    private text: string|null = null;
    private textHtml: string|null = null;

    public async beforeMount() {
        const content = (await this.event).getContent();
        if (content.msgtype === "m.image") {
            this.image = this.room._client.mxcUrlToHttp(content.url);
        }
        if (content.formatted_body) {
            this.textHtml = content["m.new_content"]?.formatted_body || content.formatted_body;
        }
        if (content.body) {
            this.text = content["m.new_content"]?.body || content.body;
            this.text = `<p>${this.text!.replace(/\n\n/g, "</br>")}</p>`;
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

.fragment ul {
    list-style-type: none;
}

.fragment.solo ul {
    list-style-type: none;
    text-align: left;
}

.fragment ul > li::before {
    content: "-";
    font-size: 32pt;
    margin-right: 50px;
}

.fragment li {
    font-size: 24pt;
}

.fragment.solo > p {
    font-size: 48pt;
}

.fragment {
    font-size: 3vh;
    > .html {
        h1 {
            font-size: 48pt;
            .emoji {
                height: 48px;
            }
        }

        h2 {
            font-size: 38pt;
            .emoji {
                height: 38px;
            }
        }
    }

    > .image {
        width: 90%;
        height: 100%;
    }

    code {
        font-size: 2vh;
    }

    .emoji {
        height: 24px;
    }
}
</style>