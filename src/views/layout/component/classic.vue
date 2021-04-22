<template>
  <div class="classic-warp-container" v-loading="$store.state.layoutConfig.layoutLoading"
    element-loading-text="切经典布局中...">
    <template v-if="!$store.state.layoutConfig.layoutLoading">
      <div :class="
          $store.state.layoutConfig.subMenuTheme === 'dark'
            ? 'classic-top-dark'
            : 'classic-top-light'
        ">
        <NavBars />
      </div>
      <div class="classic-warp">
        <el-scrollbar :class="[
            $store.state.layoutConfig.subMenuTheme === 'dark'
              ? 'submenu-theme-dark'
              : 'submenu-theme-light',
            'classic-warp-left',
          ]">
          <SubMenu :menu-list="menuList" :props="defaultProps" @getmenu="onGetMenu" />
        </el-scrollbar>
        <el-scrollbar class="classic-warp-right" ref="scrollbarRef">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="keepAliveList">
              <router-view class="classic-warp-right-view" :key="$route.path" />
            </keep-alive>
          </transition>
        </el-scrollbar>
      </div>
      <el-backtop :target="backtop" :visibility-height="400"></el-backtop>
    </template>
  </div>
</template>

<script>
import { routesFilter } from "@/utils/routesFilter";
import SubMenu from "@/components/subMenu";
import NavBars from "@/components/navBars";
export default {
  name: "layoutClassic",
  components: { SubMenu, NavBars },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title",
        index: "path",
      },
      menuList: [],
      backtop: null
    };
  },
  computed: {
    // 获取缓存路由数据
    keepAliveList() {
      return this.$store.state.keepAliveList
    }
  },
  created() {
    // 自动菜单分割数据监听
    this.bus.$on("sendClassicSplitMenuData", (menuData) => {
      this.menuList = [];
      if (menuData === null) {
        this.setTimeoutMenuData(routesFilter());
      } else {
        this.setTimeoutMenuData(menuData);
      }
    });
    this.initMenu();
  },
  destroyed() {
    // 自动菜单分割数据关闭监听
    this.bus.$off("sendClassicSplitMenuData");
  },
  mounted() {
    this.initBacktop()
  },
  methods: {
    // 初始化返回顶部，防止报错
    initBacktop() {
      this.$nextTick(() => {
        this.backtop = '.classic-warp-right .el-scrollbar__wrap'
      })
    },
    // 赋值菜单数据
    setTimeoutMenuData(menuData) {
      this.$nextTick(() => {
        this.menuList = menuData;
      });
    },
    // 未开启 `自动菜单分割`，直接使用路由数据
    initMenu() {
      if (!this.$store.state.layoutConfig.isSplitMenu) {
        this.menuList = routesFilter();
      }
    },
    // 左侧菜单点击事件
    onGetMenu(item) {
      if (item.meta.isExternalLinks) {
        if (item.meta.externalLinkType === 'open') window.open(item.meta.externalLinkUrl)
        else this.$router.push(item.meta.externalLinkUrl);
      } else {
        this.$router.push(item.path);
        this.$refs["scrollbarRef"].wrap.scrollTop = 0;
      }
    },
  },
};
</script>
