<template>
    <div class="settings-modal">
        <div class="inner">
            <div class="header">   
            <button @click="closeFn()">X</button>
            <h1> Settings </h1>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.header {
    button {
        float: right;
        border: 1px solid grey;
        border-radius: 15px;
        padding: 5px;
        width: 30px;
        margin-right: 20px;
        background: grey;
    }
}

.settings-modal {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.80);
}

.inner {
    position: fixed;
    top: 5vh;
    left: 25vw;
    width: 50vw;
    height: 90vh;
    min-height: 600px;
    border: 1px solid black;
    background: whitesmoke;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SettingsModal extends Vue {
   @Prop() private closeFn!: () => void;
}
Vue.component('SettingsModal', SettingsModal);

</script>