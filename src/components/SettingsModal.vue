<template>
    <Modal :title="`Settings - ${tabName}`" :closeFn="closeFn">
        <div class="settings-container" slot="body">
            <div class="nav">
                <ul> <!-- Options -->
                    <li :class="`button ${activeClass(0)}`">
                        <a href="#">Keymappings</a>
                    </li>
                </ul>
            </div>
            <div class="options">
                <KeymappingTab v-if="tabIndex === 0">
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
}

.nav {
    border-right: 1px solid gray;
    height: 100%;

    ul {
        list-style: none;
    }

    .button.active {
        background: lightgreen;
        border-radius: 5px;
        padding: 5px;
        margin-right: 5px;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Modal from "./Modal.vue";
import KeymappingTab from "./SettingsModalTabs/KeymappingTab.vue";

@Component({
    components: {
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

Vue.component("SettingsModal", SettingsModal);
</script>