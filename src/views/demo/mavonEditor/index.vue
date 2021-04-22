<template>
  <div>
    <el-alert title="基于Vue的markdown编辑器" type="warning" show-icon :closable="false" style="margin-bottom: 15px;">
      <span>
        文档链接：
        <font @click="open()" style="cursor: pointer;text-decoration: underline;">{{link}}</font>
      </span>
    </el-alert>
    <mavonEditor v-model="mavonValue" :subfield="false" :boxShadow="true" placeholder="请输入内容..."
      boxShadowStyle="2px 2px 2px 0px rgba(0, 0, 0, 0.03)"></mavonEditor>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "editor",
  components: { mavonEditor },
  data() {
    return {
      mavonValue: "",
      link: "https://www.npmjs.com/package/mavon-editor",
    };
  },
  methods: {
    // 打开链接
    open() {
      window.open(this.link);
    },
  },
};
</script>