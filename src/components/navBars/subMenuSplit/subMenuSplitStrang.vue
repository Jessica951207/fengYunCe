<template>
  <div class="strang-split-ment">
    <el-scrollbar class="strang-split-ment-scrollbar">
      <ul>
        <li :class="{ 'li-active': $route.meta.parent === val.path }" v-for="(val, key) in menuList" :key="key"
          @click="onMenuItemClick(val)">
          <i :class="val.meta.icon"></i>
          <div>
            {{ val.title.length >= 3 ? val.title.substring(0, 2) : val.title }}
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { routesFilter } from "@/utils/routesFilter";
export default {
  name: "subMenuSplitStrang",
  data() {
    return {
      menuList: routesFilter(),
    };
  },
  created() {
    // 监听 `tags view` 关闭
    this.bus.$on("tagsViewClose", () => {
      this.initMenu();
    });
    this.initMenu();
  },
  destroyed() {
    // 关闭监听 `tags view`
    this.bus.$off("tagsViewClose");
  },
  methods: {
    // 数据初始化
    initMenu() {
      routesFilter().map((item) => {
        if (this.$route.meta.parent === item.meta.parent) {
          this.strangSplitMentData(item);
        }
      });
    },
    // 当前菜单点击
    onMenuItemClick(item) {
      this.strangSplitMentData(item);
      this.onGetMenu(item);
    },
    // 自动菜单分割数据数据传送函数
    strangSplitMentData(item) {
      if (item.children) {
        this.bus.$emit("strangSplitMentData", item.children);
      } else {
        this.bus.$emit("strangSplitMentData", [{ ...item }]);
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
.strang-split-ment {
  width: 65px;
  background-color: #29384d;
  .strang-split-ment-scrollbar {
    height: 100%;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 65px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #e6e6e6;
        font-size: 14px;
        cursor: pointer;
        i {
          font-size: 18px;
          padding-bottom: 5px;
        }
      }
      .li-active {
        background-color: rgba(0, 153, 255, 0.8);
      }
    }
  }
}
</style>