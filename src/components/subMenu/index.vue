<template>
  <el-menu :mode="isElegant() ? 'horizontal' : 'vertical'" :active-text-color="isElegant() ? '#09f' : ''"
    :background-color="isSubMenuTheme() ? '#29384D' : ''" :text-color="isSubMenuTheme() ? '#e6e6e6' : ''"
    :default-active="isFashion() ? $route.path : defaultActive" :collapse="$store.state.layoutConfig.isCollapse"
    :class="{ 'el-menu-vertical': !isElegant() }" :unique-opened="$store.state.layoutConfig.isUniqueOpened">
    <template v-for="(val, key) in menuList">
      <el-submenu :index="val[props.index]" v-if="val[props.children] && val[props.children].length > 0" :key="key">
        <template slot="title">
          <i :class="val.meta.icon"></i>
          <span>{{ val[props.label] }}</span>
        </template>
        <SubItem :chil="val[props.children]" :props="props" @getSubItem="onMenuItemClick" class="child-menu" />
      </el-submenu>
      <el-menu-item :index="val[props.index]" v-else @click="onMenuItemClick(val)" :key="key">
        <i :class="val.meta.icon"></i>
        <span slot="title">{{ val[props.label] }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import SubItem from "./subItem";
export default {
  name: "subMenu",
  components: { SubItem },
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
    props: {
      type: Object,
      default() {
        return {
          children: "children",
          label: "label",
          index: "id",
        };
      },
    },
  },
  data() {
    return {
      defaultActive: null,
    };
  },
  methods: {
    // 初始化路由高亮与跳转等
    initMenuActive(to) {
      this.defaultActive = to.path;
    },
    // 判断是否为 `elegant 典雅布局`
    isElegant() {
      let { layout } = this.$store.state.layoutConfig
      return layout === "elegant" ? true : false;
    },
    // 判断是否为 `fashion 时尚布局`
    isFashion() {
      let { layout } = this.$store.state.layoutConfig
      return layout === "fashion";
    },
    // 主题暗色与亮色
    isSubMenuTheme() {
      let { subMenuTheme } = this.$store.state.layoutConfig
      return subMenuTheme === "dark" ? true : false;
    },
    // 当前菜单点击
    onMenuItemClick(item) {
      this.$emit("getmenu", item);
    },
  },
  watch: {
    // 监听路由实现高亮，去掉事件总线监听方法
    $route: {
      handler(to, from) {
        this.initMenuActive(to)
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
