<template>
  <div class="classicSplitMenu">
    <el-menu mode="horizontal" active-text-color="#09f" :background-color="isSubMenuTheme() ? '#29384D' : ''"
      :text-color="isSubMenuTheme() ? '#e6e6e6' : ''" :default-active="$route.meta.parent">
      <template v-for="(val, key) in menuList">
        <el-menu-item :index="val.path" @click="onMenuItemClick(val)" :key="key">
          <i :class="val.meta.icon"></i>
          <span slot="title">{{ val.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { routesFilter } from "@/utils/routesFilter";
export default {
  name: "subMenuSplitClassic",
  data() {
    return {
      menuList: routesFilter(),
    };
  },
  created() {
    this.initMenu();
  },
  methods: {
    // 数据初始化
    initMenu() {
      routesFilter().map((item) => {
        if (this.$route.meta.parent === item.meta.parent) {
          this.sendClassicSplitMenuData(item);
        }
      });
    },
    // 主题暗色与亮色
    isSubMenuTheme() {
      let { subMenuTheme } = this.$store.state.layoutConfig
      return subMenuTheme === "dark" ? true : false;
    },
    // 当前菜单点击
    onMenuItemClick(item) {
      this.sendClassicSplitMenuData(item);
      this.onGetMenu(item);
    },
    // 自动菜单分割数据数据传送函数
    sendClassicSplitMenuData(item) {
      if (item.children) {
        this.bus.$emit("sendClassicSplitMenuData", item.children);
      } else {
        this.bus.$emit("sendClassicSplitMenuData", [{ ...item }]);
      }
    },
    // 当前菜单点击函数
    onGetMenu(item) {
      if (item.meta.isExternalLinks) {
        if (item.meta.externalLinkType === 'open') window.open(item.meta.externalLinkUrl)
        else this.$router.push(item.meta.externalLinkUrl);
      } else {
        this.$router.push(item.path);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.classicSplitMenu {
  flex: 1;
  padding: 0 15px;
}
</style>