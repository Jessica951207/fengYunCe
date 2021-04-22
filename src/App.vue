<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getSession } from "@/utils/storage";
import setIntroduction from "@/utils/setIconfont.js";
export default {
  name: "App",
  mounted() {
    this.initSetIconfont();
    this.initSession();
  },
  methods: {
    initSetIconfont() {
      // 设置批量第三方 icon 图标
      setIntroduction.cssCdn();
      // 设置批量第三方 js
      setIntroduction.jsCdn();
    },
    // 初始化系统布局配置，防止刷新的时候恢复默认状态
    initSession() {
      if (getSession("layoutConfig")) {
        this.$store.dispatch("setLayoutConfig", getSession("layoutConfig"));
      }
    },
  },
};
</script>