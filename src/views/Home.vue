<template>
  <div class="home">
    <h1> Home View </h1>
    <div class="home-grid">
      <section id="my-slides">
        <PresList/>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-grid {
  display: grid;
  grid-template-columns: 50%;
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  width: 97vw;
  margin-left: 25px;
  margin-right: 25px;

  section {
    /*border: 1px solid black;*/
    text-align: left;
  }
}

.home-grid > #my-slides {
  grid-column: 1;
  grid-row: 1 / 5;
}

.home-grid > #something-else {
  grid-column: 2;
  grid-row: 1 / 5;
}
</style>

<script>
import PresList from "@/components/PresList";
import PresCard from "@/components/PresCard";

export default {
  name: 'home',
  components: {
    PresList,
  }
}
</script>
