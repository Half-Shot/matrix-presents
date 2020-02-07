<template>
    <img :src="dataUrl" v-if="dataUrl"/>
</template>

<script lang="ts">

import { Prop, Vue, Component } from "vue-property-decorator";
import qrcode from "qrcode";
import { Room } from "matrix-js-sdk";
import Config from "../../config.json";

@Component({

})
export default class QRCode extends Vue {
    @Prop() private room!: Room;
    private dataUrl = "";

    private async beforeMount() {
        try {
            this.dataUrl = await qrcode.toDataURL(`${Config.base_url}/${this.room.roomId}`);
            console.log(this.dataUrl);
        } catch (ex) {
            console.error("Failed to render QRCode: ", ex);
        }
    }
}
</script>