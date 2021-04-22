<template>
  <div class="strange-warp-container" v-loading="$store.state.layoutConfig.layoutLoading"
    element-loading-text="切怪异布局中...">
    <template v-if="!$store.state.layoutConfig.layoutLoading">
      <SubMenuSplitStrang />
      <div class="fashion-warp-left-box">
        <div :class="[
            $store.state.layoutConfig.isCollapse
              ? 'el-menu--collapse-strange-close'
              : 'el-menu--collapse-strange-open',
            'fashion-warp-logo',
            $store.state.layoutConfig.subMenuTheme === 'dark'
              ? 'fashion-warp-logo-dark'
              : 'fashion-warp-logo-light',
          ]" v-if="
            $store.state.layoutConfig.isLogo &&
            $store.state.layoutConfig.layout === 'strange'
          ">
          <div class="logo-box">
            <img src="@/assets/images/logo.svg" v-show="!$store.state.layoutConfig.isCollapse" />
            <i class="el-icon-platform-eleme icon" title="公司logo" v-show="$store.state.layoutConfig.isCollapse"></i>
          </div>
        </div>
        <el-scrollbar :class="
            $store.state.layoutConfig.subMenuTheme === 'dark'
              ? 'submenu-theme-dark'
              : 'submenu-theme-light'
          ">
          <SubMenu :menu-list="menuList" :props="defaultProps" @getmenu="onGetMenu"
            :class="$store.state.layoutConfig.isCollapse ? 'el-menu--collapse-strange-close' : 'el-menu--collapse-strange-open'" />
        </el-scrollbar>
      </div>
      <div class="fashion-warp-righ-box">
        <el-scrollbar class="fashion-warp-right" ref="scrollbarRef">
          <NavBars class="fashion-warp-nav" :class="{
              'add-nav-strange':
                !$store.state.layoutConfig.isCollapse && isFixedHead(),
              'collapse-nav':
                $store.state.layoutConfig.isCollapse && isFixedHead(),
            }" />
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="keepAliveList">
              <router-view :key="key" class="fashion-warp-right-view" :class="isFixedHeadAndIsShowTagsView"
                v-if="isShowView" />
            </keep-alive>
          </transition>
        </el-scrollbar>
      </div>
    </template>
    <el-backtop :target="backtop" :visibility-height="400"></el-backtop>
  </div>
</template>

<script>
import SubMenu from "@/components/subMenu";
import NavBars from "@/components/navBars";
import SubMenuSplitStrang from "@/components/navBars/subMenuSplit/subMenuSplitStrang";
export default {
  name: "layoutStrange",
  components: { SubMenu, NavBars, SubMenuSplitStrang },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title",
        index: "path",
      },
      menuList: [],
      key: "",
      backtop: null,
      isShowView: true
    };
  },
  computed: {
    // fashion、 strange 布局时，固定 FixedHead 且不显示 Tags-View
    isFixedHeadAndIsShowTagsView() {
      let { isFixedHead, layout, isTagsView } = this.$store.state.layoutConfig;
      if (layout === 'fashion' || layout === 'strange') {
        if (isFixedHead && isTagsView) {
          return `add-padding99`
        } else if (isFixedHead && !isTagsView) {
          return `add-padding65`
        }
      }
    },
    // 获取缓存路由数据
    keepAliveList() {
      return this.$store.state.keepAliveList
    }
  },
  created() {
    // 监听 `Tags-View` 右键菜单刷新功能
    this.bus.$on("refreshCurrentPage", (path) => {
      this.key = new Date().getTime();
      this.$router.push(path);
      this.isShowView = false;
      // 与 `src/assets/css/transition.scss` 过渡动画时间保持一致
      setTimeout(() => { this.isShowView = true }, 300);
    });
    // 自动菜单分割数据
    this.bus.$on("strangSplitMentData", (menuData) => {
      this.menuList = [];
      this.$nextTick(() => {
        this.menuList = menuData;
      });
    });
  },
  destroyed() {
    // 关闭 `Tags-View` 右键菜单刷新事件监听
    this.bus.$off("refreshCurrentPage");
    this.bus.$off("strangSplitMentData");
  },
  mounted() {
    this.initBacktop()
  },
  methods: {
    // 初始化返回顶部，防止报错
    initBacktop() {
      this.$nextTick(() => {
        this.backtop = '.fashion-warp-right .el-scrollbar__wrap'
      })
    },
    // 固定 `Breadcrumb、Tags-View`
    isFixedHead() {
      let { isFixedHead, layout } = this.$store.state.layoutConfig;
      return isFixedHead && layout === "strange";
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
