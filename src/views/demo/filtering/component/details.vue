<template>
  <div class="filtering-details">filtering-details</div>
</template>

<script>
export default {
  name: 'filteringDetails',
  data() {
    return {}
  },
  destroyed() {
    // 关闭当前项在 `tabsView` 上的显示，传送当前页面的路径即可
    this.bus.$emit('closeCurrentTabsView', '/demo/filtering-details');
  }
}
</script>

<style scoped lang="scss">
.filtering-details {
}
</style>