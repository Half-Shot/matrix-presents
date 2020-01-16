<template>
  <div class="home">
    <div class="home-grid">
      <section id="my-slides">
        <PresList/>
        <ul class="button-set">
            <li>
                <button @click="showSubscribeModal = true"> Subscribe to Slideshow </button>
            </li>
            <li>
                <button disabled="true" @click="showCreateModal = true"> Create Slideshow </button>
            </li>
        </ul>   
      </section>
    </div>
    <SubscribeModal v-if="showSubscribeModal" id="sub-modal" :closeFn="() => showSubscribeModal = false"/>
    <SubscribeModal v-if="showCreateModal" id="create-modal" :closeFn="() => showCreateModal = false"/>
  </div>
</template>

<style lang="scss" scoped>
.home-grid {
  display: grid;
  grid-template-columns: 50%;
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  margin-left: 25px;
  margin-right: 25px;

  section {
    /*border: 1px solid black;*/
    text-align: left;
  }
}

.home-grid > #my-slides {
  grid-column: 1;
  grid-row: 1 / 5;
}

.home-grid > #something-else {
  grid-column: 2;
  grid-row: 1 / 5;
}

.button-set {
    list-style: none;
}

.button-set button {
    margin-bottom: 5px;
}
</style>

<script lang="ts">
import PresList from "../components/PresList.vue";
import SubscribeModal from "../components/SubscribeModal.vue";

import Component from "vue-class-component";
import Vue from "vue";

@Component({
  components: {
    PresList,
    SubscribeModal,
  },
  name: "home",
})
export default class Slides extends Vue {
  private showSubscribeModal = false;
  private showCreateModal = false;

  private beforeMount(): void {
    this.$root.$data.sharedState.pageName = "Home";
  }
}

</script>
