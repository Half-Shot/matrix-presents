<template>
    <Modal class="subscribe-modal" title="Subscribe to a Slideshow" :closeFn="closeFn">
        <div slot="body">
            <p>You may subscribe to a slideshow by joining the Matrix room.</p>
            <form @submit="onSubmit">
                <label for="roomId">Room: </label>
                <input placeholder="#slides:example.com" v-model="roomId" type="text"/>
                <input type="submit" value="Subscribe" :disabled="!roomId"/>
            </form>
        </div>
    </Modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Modal from "./Modal.vue";

@Component
export default class SubscribeModal extends Modal {
    private roomId?: string = "";

    private onSubmit(ev: Event) {
        ev.preventDefault();
        if (this.roomId) {
            this.$router.push(`/slides/${encodeURIComponent(this.roomId)}`);
        }
    }
}

Vue.component("SubscribeModal", SubscribeModal);
</script>

// This is not scoped, because we want to modify inner.
<style lang="scss">

.subscribe-modal .inner {
    top: 33vh;
    height: 25vh;
    min-height: 333px;
}

form {
  div {
    display: block;
    margin-top: 20px;
  }

  input[type=submit] {
    margin-top: 5px;
    display: block;
  }
}

</style>