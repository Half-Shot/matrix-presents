<template>
    <div class="reaction-button">
        <ActionButton :click="() => showPicker = !showPicker">
            <SmileIcon size="1.25x"/>
        </ActionButton>
        <VEmojiPicker v-if="showPicker" @select="selectEmoji" />
    </div>
</template>

<style lang="scss" scoped>
    .reaction-button {
        display: inline-block;

        button {

        }

        div {
            z-index: 5000;
            position: absolute;
        }
    }
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Room } from 'matrix-js-sdk';
import VEmojiPicker from 'v-emoji-picker';
import ActionButton from "../ActionButton.vue";
import { SmileIcon } from 'vue-feather-icons';

@Component({
    components: {
        VEmojiPicker,
        ActionButton,
        SmileIcon,
    }
})
export default class ReactionButton extends Vue {
    @Prop() private room!: Room;
    @Prop() private slideEventId!: string;
    private showPicker = false;

    private async selectEmoji(emoji: {aliases: string[], category: string, data: string}) {
        console.log("Picked:", emoji);
        this.showPicker = false;
        await this.room._client.sendEvent(this.room.roomId, "m.reaction", {
            "m.relates_to": {
                "rel_type": "m.annotation",
                "event_id": this.slideEventId,
                "key": emoji.data,
            }
        });
    }
}
</script>