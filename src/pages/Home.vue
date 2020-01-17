<template>
  <div class="home">
    <div class="home-grid">
      <section>
        <h2>Your Slides</h2>
        <PresList :filterOwn="true"/>
        <ul class="button-set">
            <li>
                <button disabled="true" @click="showCreateModal = true"> Create Slideshow </button>
            </li>
        </ul>   
      </section>
      <section>
        <h2>Subscribed Slides</h2>
        <PresList :filterOwn="false"/>
        <ul class="button-set">
            <li>
                <button @click="showSubscribeModal = true"> Subscribe to Slideshow </button>
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3,minmax(40px,auto));
  margin-left: 25px;
  margin-right: 25px;
  width: 100%;

  section {
    /*border: 1px solid black;*/
    text-align: left;
  }
}

.home-grid:nth-child(0) {
  grid-column: 1;
  grid-column: 1 / auto;
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
