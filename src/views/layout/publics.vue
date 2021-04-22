<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="keepAliveList">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: "publics",
  data() {
    return {
      key: ""
    };
  },
  created() {
    this.bus.$on("refreshCurrentPage", (path) => {
      this.key = new Date().getTime();
    });
  },
  computed: {
    // 获取缓存路由数据
    keepAliveList() {
      return this.$store.state.keepAliveList
    }
  },
  watch: {
    $route: {
      handler(to) {
        this.key = to.path
      },
      immediate: true,
      deep: true,
    },
  }
};
</script>
