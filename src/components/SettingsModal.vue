<template>
    <Modal title="Settings" :closeFn="closeFn">
        <p slot="body"> Some data </p>
    </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Modal from "./Modal.vue";

@Component
export default class SettingsModal extends Modal {
    
}

Vue.component("SettingsModal", SettingsModal);
</script>