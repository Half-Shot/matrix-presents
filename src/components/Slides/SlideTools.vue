<template>
    <div class="tools">
        <strong>{{ slideIndex + 1 }} / {{ slideCount }}</strong> |
        <ActionButton id="modechanger" :title="MODE_TITLE[mode]" class="mode" :click="switchMode">{{ mode }}</ActionButton> |
        <strong v-if="canEdit" @click="toggleEditor">
            Editor {{ mode === "editor" ? "On" : "Off"}} |
        </strong>
        <a @click="onChangeFullscreen">{{ isFullscreen ? "Exit" : "Go"  }} Fullscreen</a>
        <!-- | <ReactionButton :room="room" :slideEventId="slideEventId"></ReactionButton> -->
    </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Room } from 'matrix-js-sdk';
import { PositionEventType } from "../../models/PositionEvent";
import ReactionButton from "./ReactionButton.vue";
import ActionButton from "../ActionButton.vue";

@Component({
    components: {
        ReactionButton,
        ActionButton,
    }
})
export default class SlideTools extends Vue {
    @Prop() private slideIndex!: number;
    @Prop() private slideCount!: number;
    @Prop() private isFullscreen!: boolean;
    @Prop() private internalMode!: string;
    @Prop() private canEdit!: boolean;
    @Prop() private room!: Room;
    @Prop() private slideEventId!: string;
    @Prop() private onChangeMode!: (mode: string) => void;
    @Prop() private onChangeFullscreen!: () => void;

    private get mode() {
        return this.internalMode;
    }

    private set mode(mode: string) {
        this.internalMode = mode;
        this.onChangeMode(mode);
    }

    private readonly MODE_TITLE = {
        viewer: "Locked to the presenters view",
        unlocked: "Unlocked to explore the presentation",
        presenter: "Present to other people in viewer mode",
    };

    private toggleEditor() {

    }

    private switchMode() {
        if (this.mode === "editor") {
            return;
        }
        if (this.mode === "viewer") {
            this.mode = "unlocked";
            return;
        }
        if (this.mode === "presenter") {
            this.mode = "viewer";
            return;
        }
        // unlocked
        const state = this.room.getLiveTimeline().getState("f");
        // Can this user be a presenter?
        const canMovePosition = state.maySendStateEvent(
            PositionEventType, this.$root.$data.sharedState.userId,
        );
        if (canMovePosition) {
            this.mode = "presenter";
        } else {
            this.mode = "viewer";
        }
    }
}
</script>