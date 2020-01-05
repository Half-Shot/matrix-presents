<template>
  
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Slide from "./Slide.vue";

@Component
export default class SlideFragment extends Vue {
    @Prop() private eventId!: string;
}
Vue.component("SlideFragment", SlideFragment);
</script>

<style>

</style>