<template>
  <div class="home">
    <div class="home-grid">
      <section>
        <h2><home-icon size="1x"></home-icon> Your Slides</h2>
        <SlideList :filterOwn="true"/>
        <ul class="button-set">
            <li>
                <ActionButton disabled="true" :click="() => showCreateModal = true">
                  <EditIcon size="1x"/>
                  Create Slideshow
                </ActionButton>
            </li>
        </ul>
      </section>
      <section>
        <h2><rss-icon size="1x"></rss-icon> Subscribed Slides</h2>
        <SlideList :filterOwn="false"/>
        <ul class="button-set">
            <li>
                <ActionButton :click="() => showSubscribeModal = true">
                  <PlusCircleIcon size="1x"/>
                  Subscribe to Slideshow
                </ActionButton>
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
import { HomeIcon, RssIcon, PlusCircleIcon, EditIcon } from 'vue-feather-icons'
import SlideList from "../components/SlideList.vue";
import SubscribeModal from "../components/SubscribeModal.vue";
import ActionButton from "@/components/ActionButton.vue";
import Component from "vue-class-component";
import Vue from "vue";


@Component({
  components: {
    SlideList,
    SubscribeModal,
    HomeIcon,
    RssIcon,
    ActionButton,
    PlusCircleIcon,
    EditIcon,
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
