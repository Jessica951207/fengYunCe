<template>
  <div class="navbar-left">
    <template v-if="layouts.layout === 'classic'">
      <div class="logo" @click="onCollapseClick">
        <img src="@/assets/images/logo.svg" />
      </div>
      <SubMenuSplitClassic v-if="layouts.isSplitMenu" />
    </template>
    <template v-if="isFashionOrStrange()">
      <i :class="layouts.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="onCollapseClick"></i>
      <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
            <span v-if="index == levelList.length - 1">{{
              item.meta.title
            }}</span>
            <a v-else @click.prevent="onHandleLink(item)">{{
              item.meta.title
            }}</a>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { setSession } from "@/utils/storage";
import { dynamicRouter } from "@/utils/routesAsync";
import SubMenuSplitClassic from "@/components/navBars/subMenuSplit/subMenuSplitClassic";
export default {
  name: "breadcrumb",
  components: { SubMenuSplitClassic },
  data() {
    return {
      levelList: null,
      layouts: {},
      deptIdList: []
    };
  },
  computed: {
    ...mapState(["layoutConfig"]),
  },
  mounted() {
    this.layouts = this.layoutConfig;
  },
  methods: {
    ...mapActions(["setLayoutConfig"]),
    // 展开/收起左侧菜单
    onCollapseClick() {
      this.layouts.isCollapse = !this.layouts.isCollapse;
      setSession("layoutConfig", this.layouts);
      this.setLayoutConfig(this.layouts);
    },
    // 顶部 `breadcrumb 面包屑`，当为 `fashion 时尚布局` 或者 `strange 怪异布局` 时显示
    isFashionOrStrange() {
      return (
        (this.layouts.isBreadcrumb && this.layouts.layout === "fashion") ||
        (this.layouts.isBreadcrumb && this.layouts.layout === "strange")
      );
    },
    // !! 前 ! 转换成布尔型。递归获取当前子节点的所有父节点
    lookupCurrentRoute(arr, path) {
      let menuArr = [];
      if (arr.length == 0) {
        if (!!path) menuArr.unshift(arr)
        return menuArr;
      }
      let fun = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          let node = data[i]
          if (node.path == nodeId) {
            menuArr.unshift(node)
            fun(arr, node.parentPath)
            break
          }
          else {
            if (!!node.children) fun(node.children, nodeId)
          }
        }
        return menuArr;
      };
      menuArr = fun(arr, path);
      return menuArr;
    },
    // 顶部 `breadcrumb 面包屑` 数组获取
    getBreadcrumb(path) {
      let originalMenuData = dynamicRouter(this.$store.state.originalMenuData)
      this.levelList = this.lookupCurrentRoute(originalMenuData.children, path);
    },
    // 顶部 `breadcrumb 面包屑` 点击
    onHandleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(path);
    },
  },
  watch: {
    // 监听路由变化，改变顶部 `breadcrumb 面包屑` 数组内容
    $route: {
      handler(to) {
        this.getBreadcrumb(to.path);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.navbar-left {
  height: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  .logo {
    width: 210px;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  i {
    font-size: 20px;
    cursor: pointer;
    margin-right: 15px;
    margin-left: 15px;
  }
}
</style>