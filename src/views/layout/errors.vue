<template>
  <div class="errors">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "errors",
};
</script>

<style scoped lang="scss">
.errors {
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>