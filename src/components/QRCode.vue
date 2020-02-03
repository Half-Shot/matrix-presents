<template>
    <img :src="this.dataurl" v-if="dataUrl"/>
</template>

<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';
import qrcode from "qrcode";
import { Room } from 'matrix-js-sdk';
export default class QRCode extends Vue {
    @Prop() private room!: Room;
    private dataUrl: string|null = null;

    private async beforeMount() {
        // TODO: Remove hardcode.
        try {
            this.dataUrl = await qrcode.toDataURL(`https://presents.half-shot.uk/slides/${this.room.roomId}`);
        } catch (ex) {
            console.error("Failed to render QRCode: ", ex);
        }
    }
}
</script>