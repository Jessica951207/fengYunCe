<template>
  <div class="elegant-warp-container" v-loading="$store.state.layoutConfig.layoutLoading"
    element-loading-text="切典雅布局中...">
    <template v-if="!$store.state.layoutConfig.layoutLoading">
      <div class="elegant-top" :class="
          $store.state.layoutConfig.subMenuTheme === 'dark'
            ? 'elegant-top-dark'
            : 'elegant-top-light'
        ">
        <div class="elegant-top-warp">
          <div class="elegant-top-logo">
            <img src="@/assets/images/logo.svg" />
          </div>
          <SubMenu :menu-list="menuList" :props="defaultProps" @getmenu="onGetMenu" />
        </div>
        <NavBars />
      </div>
      <div class="elegant-bottom">
        <el-scrollbar class="elegant-scrollbar" ref="scrollbarRef">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="keepAliveList">
              <router-view class="elegant-view" :key="$route.path" />
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
  name: "layoutElegant",
  components: { SubMenu, NavBars },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title",
        index: "path",
      },
      menuList: routesFilter(),
      backtop: null
    };
  },
  computed: {
    // 获取缓存路由数据
    keepAliveList() {
      return this.$store.state.keepAliveList
    }
  },
  mounted() {
    this.initBacktop()
  },
  methods: {
    // 初始化返回顶部，防止报错
    initBacktop() {
      this.$nextTick(() => {
        this.backtop = '.elegant-scrollbar .el-scrollbar__wrap'
      })
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