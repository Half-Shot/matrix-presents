<template>
    <p> Some filler </p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Room } from 'matrix-js-sdk';

@Component
export default class SlideFragment extends Vue {
    @Prop() private eventId!: string;
    @Prop() private room!: Room;

    public beforeMount() {

    }
}
Vue.component("SlideFragment", SlideFragment);
</script>

<style>

</style>