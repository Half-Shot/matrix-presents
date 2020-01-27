<template>
  <div id="app">
    <Nav v-if="ready" :showSettings="() => showSettings = true"/>
    <div class="content-wrapper">
      <router-view v-if="ready"/>
      <Sync v-else/>
    </div>
    <div v-if="showSettings" id="settings-modal">
      <SettingsModal :closeFn="() => showSettings = false"></SettingsModal>
    </div>
    <SettingsModal v-if="showSettings" id="settings-modal" :closeFn="() => showSettings = false"/>
  </div>
</template>

<style lang="scss">
// Globals
@import './main.scss';
</style>

<style scoped lang="scss">
@keyframes rainbow {
 0% {
  color: rgb(255, 0, 0);
 }
 25% {
  color: rgb(0, 255, 0);
 }
 75% {
  color: rgb(0, 0, 255);
 }
 100% {
  color: rgb(255, 0, 0);
 }
}

.content-wrapper {
  margin-top: 5px;
}

.rainbow {
 animation-name: rainbow;
 animation-duration: 4s;
 animation-iteration-count: infinite;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $color-primary-4;
}

.router-wrapper {
  display: inline-block;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { createGlobalClient, registerGuestIfNotLoggedIn, getClient } from "./util/matrix";
import { IndexedDBStore } from "matrix-js-sdk";
import Sync from "./components/Sync.vue";
import Nav from "./components/Nav.vue";
import SettingsModal from "./components/SettingsModal.vue";

@Component({
  components: {
    Sync,
    Nav,
    SettingsModal,
  },
  name: "app",
})
export default class App extends Vue {
  private showSettings = false;
  private ready = false;

  private async beforeMount() {
    console.log("App mounting!");

  }

  private async mounted() {
    const suggestedHs = this.$route.query.guesths as string|null;
    await registerGuestIfNotLoggedIn(suggestedHs);
    // We should set this somewhere else.
    const client = createGlobalClient();
    client.startClient();
    client.on("sync", this.onSync.bind(this));
  }

  private async onSync(state: string, prevState: string) {
      console.log(`Sync ${prevState}->${state}`);
      if (state === "SYNCING" && !this.ready) {
          const client = getClient();
          const profile = await client.getProfileInfo(this.$root.$data.sharedState.userId);
          this.$root.$data.sharedState.displayName = profile && profile.displayname ? profile.displayname : userId;
          this.ready = true;
      }
  }
}

</script>
