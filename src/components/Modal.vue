<template>
    <div class="modal">
        <div class="inner">
            <div class="header">   
                <button @click="closeFn()">X</button>
                <h1> {{ title }} </h1>
            </div>
            <div class="body">
                <slot name="body"></slot>
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
        background: $color-secondary-1-0;
    }

    h1 {
        text-align: left;
        margin-left: 15px;
        font-size: 18pt;
    }
}

.modal {
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
    background: $color-secondary-1-0;

    .body {
        margin-left: 15px;
        text-align: left;
        height: 90%;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  @Prop() private closeFn!: () => void;
  @Prop() private title!: string;
  @Prop() private height!: string;
}
Vue.component("Modal", Modal);
</script>