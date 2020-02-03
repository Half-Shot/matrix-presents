<template>
    <main>
        <p> Syncing as <strong>{{ name }}</strong></p>
        <p v-if="slow">Taking too long? <router-link :to="`/logout`">Logout</router-link></p>
    </main>
</template>

<style lang="scss" scoped>
p {
    text-align: center;
}
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "app",
})
export default class Sync extends Vue {
    private slow = false;
    private timer?: number;

    get name() {
        if (this.$root.$data.sharedState.isGuest) {
            return `a Guest`;
        }
        return this.$root.$data.sharedState.displayName || this.$root.$data.sharedState.userId;
    }

    private beforeMount() {
        this.slow = false;
        if (this.$root.$data.sharedState.isGuest) {
            return; // Do not show logout for guests.
        }
        this.timer = setInterval(() => {
            this.slow = true;
        }, 30000);
    }

    private beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
};
</script>