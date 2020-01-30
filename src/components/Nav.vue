<template>
    <div id="nav">
      <div id="status">
        <h1 v-if="pageName"> {{ pageName }} </h1>
      </div>
      <div id="links">
        <template v-if=!isGuest>
          <BellIcon/> 0 | 
          Logged in as {{ displayName }} |
          <router-link to="/">My Slides</router-link> |
          <a href="#" @click="showSettings">Settings</a> |
          <router-link to="/logout">Logout</router-link>
        </template>
        <template v-else-if=isGuest>
        Guest |
        <router-link to="/login">Login</router-link>
        </template>
      </div>
    </div>
</template>

<style lang="scss" scoped>
#nav {
  padding: 1vh 2vw;
  padding-bottom: 0;
  min-height: 7vh;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
  #links {
    max-height: 50px;
    width: 50%;
    text-align: right;
    float: right;
    margin-top: 15px;
  }
  #status {
    width: 50%;
    text-align: left;
    float: left;

    h1 {
      font-size: 18pt;
      max-height: 50px;
    }
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { BellIcon } from "vue-feather-icons";

@Component({
  components: { BellIcon }
})
export default class Login extends Vue {
    @Prop() public showSettings!: () => void;

    public get notificationCount() {
        return this.$root.$data.sharedState.notificationCount;
    }

    public get isGuest() {  
        return this.$root.$data.sharedState.isGuest;
    }

    public get displayName() {
        return this.isGuest ? "Guest" : this.$root.$data.sharedState.displayName;
    }

    public get pageName() {
        return this.$root.$data.sharedState.pageName;
    }
}
</script>