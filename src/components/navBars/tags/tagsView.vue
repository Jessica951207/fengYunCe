<template>
  <div class="tags-warp">
    <TagsScrollPane ref="tagsScrollPane">
      <div class="tags-flex">
        <div class="tags-flex-item" @contextmenu.prevent="onContextmenu(v, k, $event)" v-for="(v, k) in tagsList"
          :key="k" @click="onTagViewClick">
          <router-link :class="[isActive(v) ? 'tags-ative' : '', 'tags-view']" :to="{ path: v.path }" ref="tag">
            <span>{{ v.meta.title }}</span>
            <i class="el-icon-close" v-if="!v.meta.affix" @click.prevent.stop="onCloseSelectedTag(v, k)"></i>
          </router-link>
        </div>
      </div>
    </TagsScrollPane>
    <TagsContextmenu :dropdown="dropdown" ref="tagsContextmenu" />
  </div>
</template>

<script>
import TagsContextmenu from "@/components/navBars/tags/tagsContextmenu";
import TagsScrollPane from "@/components/navBars/tags/tagsScrollPane";
import { routesFilter } from "@/utils/routesFilter";
import { getSession, getLocal } from "@/utils/storage";
export default {
  name: "tagsView",
  components: { TagsContextmenu, TagsScrollPane },
  data() {
    return {
      userInfo: {},
      tagsList: [],
      dropdown: {
        x: "",
        y: "",
      },
    };
  },
  created() {
    this.initTagsList();
    // 右键菜单 `tagsContextmenu.vue`, 每项点击监听
    this.bus.$on("closeTagsContextmenu", (res) => {
      const action = {
        0: "onRefresh",
        1: "closeCurrentTags",
        2: "closeOtherTags",
        3: "closeAllTags",
      };
      this[action[res.id]] && this[action[res.id]](res);
      /**
       * 当前项关闭时，怪异布局中使用
       * 路径：`\src\components\navBars\subMenuSplit\strang.vue`
       */
      this.onTagViewClick();
    });
    /**
     * 布局切换重新初始化设置了 `affix: true` 固定项数据(router -> routes.js)
     * 路径：\src\components\navBars\dropdown\dropdownDrawer.vue
     */
    this.bus.$on("initTagsList", () => {
      this.initTagsList();
    });
    /**
     * 监听离开详情页，如 `筛选组件` 中列表点击，离开时，关闭 `tagsView` 中
     * 显示的详情页 `tags` 项
     */
    this.bus.$on("closeCurrentTabsView", (path) => {
      this.tagsList = this.tagsList.filter((v) => v.path !== path);
    });
  },
  destroyed() {
    // 关闭右键菜单 `tagsContextmenu.vue`, 每项点击监听
    this.bus.$off("closeTagsContextmenu");
    this.bus.$off("closeCurrentTabsView");
  },
  methods: {
    // 获取用户信息，设置对应nav tag session
    TagsSession(tags) {
      const name = getSession("userInfo").userName + "-tags";
      const value = [...tags];
      localStorage.setItem(name, JSON.stringify(value));
    },
    // 递归过滤 `affix: true` 的数组
    filterMenu(arr) {
      return arr
        .filter((item) => {
          return item.meta.affix;
        })
        .map((item) => {
          // 必填(导航菜单使用到，简化routes.js)
          item["title"] = item.meta.title;
          item = Object.assign({}, item);
          if (item.children) {
            item.children = this.filterMenu(item.children);
          }
          const Nitem = {
            name: item.name,
            path: item.path,
            meta: {
              icon: item.meta.icon,
              parent: item.meta.parent,
              title: item.meta.title,
              affix: item.meta.affix,
            },
          };
          return (item = Nitem);
        });
    },
    // 递归查找当前路径下的组件信息
    filterCurrentMenu(arr, currentPath, callback) {
      arr.map((item) => {
        if (item.path === currentPath) {
          callback(item);
          return false;
        }
        item = Object.assign({}, item);
        if (item.children) {
          item.children = this.filterCurrentMenu(
            item.children,
            currentPath,
            callback
          );
        }
      });
    },
    // 数组对象去重
    duplicate(arr) {
      let newobj = {};
      arr = arr.reduce((preVal, curVal) => {
        newobj[curVal.path]
          ? ""
          : (newobj[curVal.path] = preVal.push(curVal));
        return preVal;
      }, []);
      return arr;
    },
    // 初始化设置了 `affix: true` 和当前路由（防止刷新时丢失） 固定项数据(router -> routes.js)
    initTagsList() {
      const name = getSession("userInfo").userName + "-tags";
      let arr = getLocal(name) || [];
      this.tagsList = this.duplicate([
        ...this.filterMenu(routesFilter()),
        ...arr,
      ]);
      // 防止菜单设置了 `hidden: true` 时，刷新页面，`tagsView` 丢失高亮问题
      let flag =
        this.tagsList.filter((v) => v.path === this.$route.path).length <= 0
          ? true
          : false;
      if (flag) this.$router.push("/home");
    },
    // 当前高亮的菜单
    isActive(v) {
      return v.path === this.$route.path;
    },
    // 路由改变时，横向滚动 `tags-view`
    moveToCurrentTag() {
      this.$nextTick(() => {
        const tags = this.$refs.tag;
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.tagsScrollPane.moveToTarget(tag);
          }
        }
      });
    },
    // 当前项 `tags-view` 点击(怪异布局中使用到)
    onTagViewClick() {
      if (this.$store.state.layoutConfig.layout === "strange") {
        this.bus.$emit("tagsViewClose");
      }
    },
    // 当前项 `tags-view` icon 关闭时点击
    onCloseSelectedTag(v, k) {
      if (this.tagsList.length === 1) {
        this.bus.$emit("refreshCurrentPage", v.path);
      } else {
        let arr = this.tagsList;
        arr.splice(k, 1);
        if (v.path === this.$route.path) {
          if (arr.length === k) {
            this.routerPush(arr[k - 1].path);
          } else {
            this.routerPush(arr.slice(-1)[0].path);
          }
        }
        this.onTagViewClick();
      }
    },
    // 路由跳转函数
    routerPush(path) {
      this.$router.push(path);
    },
    // 右键菜单点击时显示菜单列表
    onContextmenu(v, k, e) {
      let { clientX, clientY } = e;
      this.dropdown.x = clientX;
      this.dropdown.y = clientY;
      this.$refs.tagsContextmenu.setAppendToBody(v, k, e);
    },
    // 右键菜单 `刷新` 功能
    onRefresh(res) {
      this.bus.$emit("refreshCurrentPage", res.path);
    },
    // 右键菜单 `关闭` 功能
    closeCurrentTags(res) {
      this.onCloseSelectedTag(res, res.k);
    },
    // 右键菜单 `关闭其他` 功能
    closeOtherTags(res) {
      let arr = [];
      this.filterCurrentMenu(routesFilter(), res.path, (res) => {
        arr.push(res);
      });
      this.tagsList = this.duplicate([
        ...this.filterMenu(routesFilter()),
        ...arr,
      ]);
      this.routerPush(res.path);
    },
    // 右键菜单 `全部关闭` 功能
    closeAllTags() {
      let { path } = this.tagsList[0];
      this.tagsList = this.filterMenu(routesFilter());
      path = [...this.tagsList].length
        ? [...this.tagsList][[...this.tagsList].length - 1]
        : path;
      this.routerPush(path);
    },
  },
  watch: {
    $route: {
      handler(to) {
        let { meta } = to;
        let flag = this.tagsList.find((v) => v.meta.title === meta.title);
        this.moveToCurrentTag();
        if (flag) return false;
        this.tagsList.push({ ...to });
      },
      immediate: true,
      deep: true,
    },
    tagsList(val) {
      if (!val.length) {
        this.$router.push({ path: "/" });
      }
      const value = val.map((item) => {
        const Nitem = {
          name: item.name,
          path: item.path,
          meta: {
            icon: item.meta.icon,
            parent: item.meta.parent,
            title: item.meta.title,
            affix: item.meta.affix,
          },
        };
        return (item = Nitem);
      });
      this.TagsSession([...value]);
      // 监听数组改变，更新 `el-scrollbar`，防止横向滚动条不出现
      this.$refs.tagsScrollPane.updateScrollbar();
    },
  },
};
</script>

<style scoped lang="scss">
.tags-warp {
  height: 100%;
  white-space: nowrap;
  width: 100%;
  .el-scrollbar {
    height: 100%;
  }
  .tags-flex {
    display: flex;
    align-items: center;
    height: 33px;
    .tags-flex-item {
      display: inline-block;
      margin-right: 5px;
      &:first-of-type {
        margin-left: 15px;
      }
      .tags-view {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background-color: #fff;
        padding: 0 10px;
        font-size: 12px;
        text-decoration: none;
        &:hover {
          background: #f6f6f6;
        }
        i {
          height: 16px;
          width: 16px;
          display: inline-block;
          font-size: 12px;
          border-radius: 100%;
          text-align: center;
          padding: 2px;
          margin-left: 5px;
          transform: scale(0.7);
          &:hover {
            color: white;
            background-color: #97a8be;
            transform: scale(0.8);
          }
        }
      }
      .tags-ative {
        /*background-color: #09f;*/
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        position: relative;
        &:hover {
          background: #42b983;
        }
        &::before {
          content: "";
          background-color: white;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
