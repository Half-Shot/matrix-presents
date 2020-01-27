<template>
  <div class="login">
    <Login/>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: "login",
  components: {
    Login,
  },
  beforeMount: () => {
    this.$root.$data.sharedState.pageName = "Login";
  }
};
</script>