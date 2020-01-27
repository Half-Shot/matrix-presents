<template>
  <div class="table">
        <div class="paddle" id="paddle1"/>
        <div class="paddle" id="paddle2"/>
        <div class="puck" :style="`top: ${puckTop}px; left: ${puckTop}px`"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MatrixClient } from 'matrix-js-sdk';

@Component
export default class TableTennis extends Vue {
    @Prop() private client!: MatrixClient;

    private puckTop = 50;
    private puckLeft = 50;

    private beforeMount() {
        console.log("Mounted table tennis");
        setInterval(() => {
            this.puckTop++;
            this.puckLeft++;
        }, 33);
    }
}
Vue.component("TableTennis", TableTennis);
</script>

<style scoped lang="scss">
.puck {
    position: relative;
    width: 25px;
    height: 25px;
    background: red;
}
</style>