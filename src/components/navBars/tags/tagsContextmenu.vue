<template>
  <div>
    <transition name="el-zoom-in-center">
      <ul class="el-dropdown-menu el-popper el-dropdown-menu--medium custom-contextmenu"
        :style="`top: ${this.dropdown.y}px;left: ${this.dropdown.x}px;`" x-placement="bottom-end" id="contextmenu"
        v-show="isDropdown">
        <li class="el-dropdown-menu__item" v-for="(v, k) in dropdownList" :key="k" @click="menuClose(v.id)">
          <span v-if="v.affix !== affix">{{ v.txt }}</span>
          <span v-else-if="!v.affix & (v.affix == affix)">{{ v.txt }}</span>
        </li>
        <div x-arrow class="popper__arrow" style="left:5px"></div>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: "tagsContextmenu",
  props: {
    dropdown: {
      type: Object,
    },
  },
  data() {
    return {
      isDropdown: false,
      params: "",
      dropdownList: [
        { id: 0, txt: "刷新", affix: false },
        { id: 1, txt: "关闭", affix: true },
        { id: 2, txt: "关闭其他", affix: false },
        { id: 3, txt: "全部关闭", affix: false },
      ],
      affix: false,
    };
  },
  mounted() {
    // 监听 `body` 点击
    document.body.addEventListener("click", this.close);
  },
  destroyed() {
    // 移除监听 `body`
    document.body.removeEventListener("click", this.close);
  },
  methods: {
    // 打开右键菜单
    open() {
      this.close();
      setTimeout(() => {
        this.isDropdown = true;
      }, 10);
    },
    // 关闭右键菜单
    close() {
      this.isDropdown = false;
    },
    // 父组件(tagsView.vue) `onContextmenu` 点击时调用
    setAppendToBody(v, k, e) {
      this.affix = v.meta.affix;
      let { innerText } = e.target;
      this.params = {
        txt: innerText,
        path: v.path,
        k,
      };
      this.open();
      document.body.appendChild(document.getElementById("contextmenu"));
    },
    // 当前项点击时，传送数据到父组件(tagsView.vue)
    menuClose(id) {
      this.bus.$emit("closeTagsContextmenu", { id, ...this.params });
    },
  },
};
</script>

<style scoped lang="scss">
.custom-contextmenu {
  transform-origin: center top;
  z-index: 2190;
  position: fixed;
  .el-dropdown-menu__item {
    font-size: 12px !important;
  }
}
</style>
