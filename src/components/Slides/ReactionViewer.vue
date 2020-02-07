<template>
    <div class="reaction-viewer" :key="emojiHash">
        <li v-for="(count, emoji) in emojiSet" :key="emoji"> 
          <div v-emoji>
            {{ emoji }}
            <span>{{ count }}</span>
          </div>
        </li>
    </div>
</template>

<style lang="scss" scoped>
.reaction-viewer {
  text-align: right;
  display: block;
  position: absolute;
  bottom: 5vh;
  right: 5vh;

  .emoji {
      height: 36pt;
  }

  span {
    display: inline-block;
    position: absolute;
    bottom: 0px;
    right: 5px;
    color: red;
    font-weight: 800;
    font-size: 18pt;
  }
}
li > div {
    position: relative;
}

li {
  display: inline;
  list-style-type: none;
  padding-right: 20px;
  float: right;
}

</style>

<script lang="ts">

interface IEmojiSet {
    [emoji: string]: number;
}

import { Room, MatrixEvent } from 'matrix-js-sdk';
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({})
export default class ReactionViewer extends Vue {
    @Prop() private room!: Room;
    @Prop() private eventId!: string;
    private boundOnEvent!: any;
    private _emojiSet: IEmojiSet;
    private emojiHash = "";

    private get emojiSet() {
        this.emojiHash = Object.keys(this._emojiSet).join("") + ":" + Object.values(this._emojiSet).join("")
        return this._emojiSet;
    }

    private set emojiSet(set) {
        this._emojiSet = set;
    }
    
    private async beforeMount() {
        this.boundOnEvent = this.onEvent.bind(this);
        this.room._client.on("event", this.boundOnEvent);
        console.log(`Mounted ReactionViewer for ${this.room.roomId}`);
        try {
            const { chunk } = await this.room._client._mpAggregations(this.room.roomId, this.eventId);
            const set = {};
            chunk.forEach(item => {
                set[item.key] = item.count;
            });
            this.emojiSet = set;
            console.log(set, this.emojiSet);
        } catch (ex) {
            console.warn("Could not get aggregations", ex);
        }
    }

    private async onEvent(event: MatrixEvent) {
        if (event.getRoomId() !== this.room.roomId) {
            return;
        }
        if (event.getType() !== "m.reaction") {
            return;
        }
        // Possibly a reaction.
        const content = event.getContent()["m.relates_to"];
        if (!content || content.rel_type !== "m.annotation" || !content.key || content.key.length > 2) {
            return;
        }
        console.log("Got a reaction of:", content.key);
        const set = this.emojiSet;
        set[content.key] = (set[content.key] || 0) + 1;
        this.emojiSet = set;
        console.log(set);
        // Ugly horrible hack
        this.$forceUpdate();
    }

    private beforeDestroy() {
        this.room._client.removeListener("event", this.boundOnEvent);
    }
}
</script>