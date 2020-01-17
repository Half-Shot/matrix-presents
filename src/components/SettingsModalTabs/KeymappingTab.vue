<template>
    <div>
        Keymappings
    </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class KeymappingsTab extends Vue {
    private static readonly tabName = "Keymappings";
}
</script>