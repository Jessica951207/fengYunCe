<template>
  <div>
    <div class="navbar" :class="{'navbar-shadow': isClassic()}">
      <Breadcrumb />
      <Dropdown />
    </div>
    <div class="tags" v-if="isFashionOrStrange()">
      <TagsView />
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/navBars/dropdown/dropdown";
import Breadcrumb from "@/components/navBars/breadcrumb/breadcrumb";
import TagsView from "@/components/navBars/tags/tagsView";
export default {
  name: "navBars",
  components: {
    Dropdown,
    Breadcrumb,
    TagsView,
  },
  methods: {
    // 判断当前布局为 `fashion 时尚` 或者 `strange 怪异` 布局时显示
    isFashionOrStrange() {
      let { isTagsView, layout } = this.$store.state.layoutConfig;
      return (
        (isTagsView && layout === "fashion") ||
        (isTagsView && layout === "strange")
      );
    },
    // 布局为 `classic 经典布局` 时显示
    isClassic() {
      let { layout } = this.$store.state.layoutConfig;
      return layout === 'classic' ? true : false
    }
  },
};
</script>

<style scoped lang="scss">
.navbar {
  height: 50px;
  background: #fff;
  padding-right: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
.navbar-shadow {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.tags {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>
