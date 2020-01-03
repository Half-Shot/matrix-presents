<template>
  <div class="slide-card">
      This is a slide card.
      {{ roomId }}
  </div>
</template>

<style scoped lang="scss">
.slide-card {
    border-radius: 5px;
    border: 1px solid black;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PresCard extends Vue {
  @Prop() private roomId!: string;
}

Vue.component('PresCard',PresCard);
</script>