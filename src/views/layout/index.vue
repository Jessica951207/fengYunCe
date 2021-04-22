<template>
  <Classic v-if="$store.state.layoutConfig.layout === 'classic'" />
  <Fashion v-else-if="$store.state.layoutConfig.layout === 'fashion'" />
  <Elegant v-else-if="$store.state.layoutConfig.layout === 'elegant'" />
  <Strange v-else-if="$store.state.layoutConfig.layout === 'strange'" />
</template>

<script>
export default {
  name: "layout",
  components: {
    Classic: () => import("./component/classic"),
    Fashion: () => import("./component/fashion"),
    Elegant: () => import("./component/elegant"),
    Strange: () => import("./component/strange"),
  },
};
</script>