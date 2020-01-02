<template>
  <div id="app">
    <div id="nav">
      <template v-if=(this.$root.$data.userId)>
        Logged in as {this.$root.$data.displayName} |
        <router-link to="/">My Slides</router-link> |
        <router-link to="/login">Account</router-link> |
        <router-link to="/logout">Logout</router-link>
      </template>
      <router-link v-if=(!this.$root.$data.userId) to="/login">Login</router-link> |
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  float:right;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
  
}
</style>