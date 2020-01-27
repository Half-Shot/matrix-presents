<template>
    <Modal title="User Settings" :closeFn="closeFn">
        <div class="settings-container" slot="body">
            <div class="nav">
                <ul> <!-- Options -->
                    <li :class="`button ${activeClass(0)}`">
                        <a @click="tabIndex = 0" href="#">General</a>
                    </li>
                    <li :class="`button ${activeClass(1)}`">
                        <a @click="tabIndex = 1" href="#">Keymappings</a>
                    </li>
                </ul>
            </div>
            <div class="options">
                <GeneralTab v-if="tabIndex === 0">
                </GeneralTab>
            </div>
            <div class="options">
                <KeymappingTab v-if="tabIndex === 1">
                </KeymappingTab>
            </div>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.settings-container {
    column-count: 2;
    columns: 10vw auto;
    column-gap: 20px;
    height: 100%;
}

.nav {
    border-right: 1px solid $color-secondary-1-1;
    height: 100%;

    ul {
        list-style: none;
    }

    .button.active {
        background: $color-primary-1;
        border-radius: 5px;
        padding: 5px;
        margin-right: 5px;
    }
}
</style>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Modal from "./Modal.vue";
import GeneralTab from "./SettingsModalTabs/GeneralTab.vue";
import KeymappingTab from "./SettingsModalTabs/KeymappingTab.vue";

@Component({
    components: {
        GeneralTab,
        KeymappingTab,
    }
})
export default class SettingsModal extends Modal {
    private tabIndex = 0;

    private activeClass(tab: number) {
        return this.tabIndex === tab ? `active` : "";
    }

    private gotoTab(tabIndex: number) {
        this.tabIndex = tabIndex;
    }
}
</script>