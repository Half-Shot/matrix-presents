<template>
  <div class="slide" v-if=!loading>
    <header :class="headerClass">
      <h1 v-if="slideEv.getContent().title !== undefined" v-text="slideEv.getContent().title"></h1>
      <h2 v-if="slideEv.getContent().subtitle !== undefined" v-text="slideEv.getContent().subtitle"></h2>
      <h3 v-if="author !== undefined && headerClass == 'title'">
        {{ author }}
        <img :src="authorAvatar" title="avatar" />
      </h3>
    </header>
    <main>
      <section :class="`column ${soloClass}`" v-for="(column, index) in columns" :key="index">
        <SlideFragment
          v-for="eventId in column"
          :isSolo="column.length === 1"
          :key="eventId"
          :eventId="eventId"
          :event="getEvent(room.roomId, eventId)"
          :room="room"
        />
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
header.normal {
    margin-top: 30px;
    margin-left: 5%;
}

header.title {
  text-align: center;
  position: relative;
  top: 15vh;
  margin-left: 5px;

  h1 {
    font-size: 72pt;
  }

  h2 {
    font-size: 40pt;
  }

  h3 {
    color: #777777;
    font-size: 30pt;
    img {
      border-radius: 50%;
    }
  }
}

header {
  h1 {
    color: #111111;
    font-size: 40pt;
  }
  h2 {
    color: #444444;
    font-size: 24pt;
  }
}

.slide {
  text-align: left;
  min-width: 90vw;
  min-height: 80vh;
  color: #2c3e50;
}

main {
  display: flex;
  width: 90%;
  margin-left: 5%;
  height: 100%;
}

.column {
    margin-left: 45px;
    flex-basis: max-content;
}

.column:nth-child(1) {
    margin-left: 0;
}

.column.solo {
  margin-top: 25px;
  height: 80vh;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.column.multi {
  flex: 1;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Room, MatrixEvent } from "matrix-js-sdk";
import { getMatrixEvent } from "../util/matrix";

interface SlideEvent {
  type: "uk.half-shot.presents.slide";
  sender: string;
  content: {
    pong?: boolean;
    title?: string;
    subtitle?: string;
    columns?: [string[]];
  };
}

@Component
export default class Slide extends Vue {
  @Prop() private room!: Room;
  @Prop() private eventId!: string;
  private loading = true;
  private slideEv: MatrixEvent | null = null;

  private get isPong() {
    return this.slideEv?.getContent().pong === true;
  }

  private get headerClass() {
    return (this.slideEv?.getContent().columns) ? "normal" : "title";
  }

  private get columns() {
    return this.slideEv?.getContent().columns || [];
  }

  private getEvent(roomId: string, eventId: string) {
    return getMatrixEvent(roomId, eventId);
  }

  private get author() {
    if (!this.slideEv) {
      return null;
    }
    return this.slideEv.getSender().rawDisplayName;
  }

  private get soloClass() {
    return this.columns.length === 1 ? "solo" : "multi";
  }

  private get authorAvatar() {
    if (!this.slideEv) {
      return null;
    }
  
    return this.slideEv.getSender()
      .getAvatarUrl(this.room._client.getHomeserverUrl(), 64, 64, "scale");
  }

  private beforeMount() {
    console.log(`Loading ${this.eventId}`);
    getMatrixEvent(this.room.roomId, this.eventId)
      .then((ev) => {
        console.log(`Loaded event`, ev);
        this.slideEv = ev;
      })
      .catch((ex) => {
        console.error("Error fetching event for slide:", ex);
        // Show an error
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>