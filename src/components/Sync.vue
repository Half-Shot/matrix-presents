<template>
    <p> Syncing as {{ userId }}</p>
</template>

<style lang="scss" scoped>

</style>

<script>
export default {
    name: "sync",
    components: { },
    computed: {
        userId: function() {
            return this.$root.$data.sharedState.userId;
        },
    },
};
</script>