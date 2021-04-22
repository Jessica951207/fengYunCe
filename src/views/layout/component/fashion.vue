<template>
  <div class="fashion-warp-container" v-loading="$store.state.layoutConfig.layoutLoading"
    element-loading-text="切时尚布局中...">
    <template v-if="!$store.state.layoutConfig.layoutLoading">
      <div class="fashion-warp-left-box">
        <div :class="[
            $store.state.layoutConfig.isCollapse ? 'collapse-logo' : '',
            'fashion-warp-logo',
            $store.state.layoutConfig.subMenuTheme === 'dark'
              ? 'fashion-warp-logo-dark'
              : 'fashion-warp-logo-light',
          ]" v-if="
            $store.state.layoutConfig.isLogo &&
            $store.state.layoutConfig.layout === 'fashion'
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
          <SubMenu :menu-list="menuList" :props="defaultProps" @getmenu="onGetMenu" />
        </el-scrollbar>
      </div>
      <div class="fashion-warp-righ-box">
        <el-scrollbar class="fashion-warp-right" ref="scrollbarRef">
          <NavBars class="fashion-warp-nav" :class="{
              'add-nav': !$store.state.layoutConfig.isCollapse && isFixedHead(),
              'collapse-nav':
                $store.state.layoutConfig.isCollapse && isFixedHead(),
            }" />
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="keepAliveList">
              <router-view class="fashion-warp-right-view" :class="isFixedHeadAndIsShowTagsView" :key="key"
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
import { routesFilter } from "@/utils/routesFilter";
import SubMenu from "@/components/subMenu";
import NavBars from "@/components/navBars";
export default {
  name: "layoutFashion",
  components: { SubMenu, NavBars },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title",
        index: "path",
      },
      menuList: routesFilter(),
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
  },
  destroyed() {
    // 关闭 `Tags-View` 右键菜单刷新事件监听
    this.bus.$off("refreshCurrentPage");
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
      return isFixedHead && layout === "fashion";
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
