<template>
    <p> Syncing as <strong>{{ name }}</strong></p>
</template>

<style lang="scss" scoped>
p {
    text-align: center;
}
</style>
<script>
export default {
    name: "sync",
    components: { },
    computed: {
        name: function() {
            if (this.$root.$data.sharedState.isGuest) {
                return `a Guest`;
            }
            return this.$root.$data.sharedState.displayName || this.$root.$data.sharedState.userId;
        },
    },
};
</script>