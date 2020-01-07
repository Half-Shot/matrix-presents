<template>
  <div id="app">
    <div id="nav">
      <div id="status">
        <h1 v-if="$root.$data.sharedState.pageName"> {{ $root.$data.sharedState.pageName }} </h1>
      </div>
      <div id="links">
        <template v-if="$root.$data.sharedState.userId">
          Logged in as {{ $root.$data.sharedState.displayName }} |
          <router-link to="/">My Slides</router-link> |
          <a href="#" @click="showSettings = true">Settings</a> |
          <router-link to="/logout">Logout</router-link>
        </template>
        <router-link v-if=(!this.$root.$data.sharedState.userId) to="/login">Login</router-link>
      </div>
    </div>
    <div class="content-wrapper">
      <router-view/>
    </div>

    <div v-if="showSettings" id="settings-modal">
      <SettingsModal :closeFn="() => showSettings = false"></SettingsModal>
    </div>
    <SettingsModal v-if="showSettings" id="settings-modal" :closeFn="() => showSettings = false"/>
  </div>
</template>

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
  margin: 30px 50px;
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
  color: #2c3e50;
}

#nav {
  padding: 3vh 2vw;
  width: 96vw;
  min-height: 7vh;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
  #links {
    width: 50%;
    text-align: right;
    float: right;
  }
  #status {
    width: 50%;
    text-align: left;
    float: left;

    h1 {
      font-size: 18pt;
    }
  }
}

.router-wrapper {
  display: inline-block;
}
</style>

<script>
import { createGlobalClient } from "./util/matrix";
import SettingsModal from "@/components/SettingsModal";
import { Filter, IndexedDBStore } from "matrix-js-sdk";

export default {
  name: "app",
  data: () => ({
    showSettings: false,
  }),
  beforeMount: async function() {
    console.log("App mounting!");
    if (!this.$root.$data.sharedState.userId) {
      console.log("Not creating client, not logged in!");
      return;
    }
    // We should set this somewhere else.
    const client = createGlobalClient();
    const profile = await client.getProfileInfo(this.$root.$data.sharedState.userId);
    this.$root.$data.sharedState.displayName = profile.displayname || this.$root.$data.sharedState.userId;
    const filter = new Filter('', '');
    filter.setDefinition({

    });
    filter.filterId = client.getOrCreateFilter("matrix-presents.slides", filter);
    filter.userId = this.$root.$data.sharedState.userId;
    const store = new IndexedDBStore({
      indexedDB,
    });
    await store.startup(); // load from indexed db
    client.startClient({
      filter,
      store,
      localStorage,
    });
  }
}

</script>
