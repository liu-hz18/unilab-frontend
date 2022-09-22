<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view v-if="isRouterAlive" />
    </transition>
  </div>
</template>

<script>
export default {
  name: "UniLab",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
}

.fade-enter-active {
  animation: opacity 0.7s;
}
</style>
