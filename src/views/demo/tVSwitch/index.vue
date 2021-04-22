<template>
  <div>
    <el-button size="small" @click="visible.show1 = true">不显示底部按钮</el-button>
    <el-button type="primary" size="small" @click="visible.show2 = true">显示底部按钮</el-button>
    <el-button type="success" size="small" @click="visible.show3 = true">插入至 body 元素上</el-button>
    <el-button type="warning" size="small" @click="visible.show4 = true">综合使用</el-button>

    <Popup :visible.sync="visible.show1" title="不显示底部按钮">
      <h3>
        提供具名插槽或需要接收 prop 的插槽。
        <a href="https://cn.vuejs.org/v2/api/#v-slot" target="_blank">https://cn.vuejs.org/v2/api/#v-slot</a>
      </h3>
    </Popup>

    <Popup :visible.sync="visible.show2" title="显示底部按钮" ref="show2">
      <h3>
        提供具名插槽或需要接收 prop 的插槽。
        <a href="https://cn.vuejs.org/v2/api/#v-slot" target="_blank">https://cn.vuejs.org/v2/api/#v-slot</a>
      </h3>
      <template v-slot:footer>
        <el-button size="small" @click="$refs.show2.hide()">取消</el-button>
        <el-button type="primary" size="small" @click="$refs.show2.hide()">确认</el-button>
      </template>
    </Popup>

    <Popup :visible.sync="visible.show3" title="插入至 body 元素上" :append-to-body="true">
      <h3>
        提供具名插槽或需要接收 prop 的插槽。
        <a href="https://cn.vuejs.org/v2/api/#v-slot" target="_blank">https://cn.vuejs.org/v2/api/#v-slot</a>
      </h3>
    </Popup>

    <Popup :visible.sync="visible.show4" title="综合使用" :append-to-body="true" ref="show4">
      <h3 v-for="v in 50" :key="v" style="line-height: 30px;">
        {{v}}、提供具名插槽或需要接收 prop 的插槽。
        <a href="https://cn.vuejs.org/v2/api/#v-slot" target="_blank">https://cn.vuejs.org/v2/api/#v-slot</a>
      </h3>
      <template v-slot:footer>
        <el-button size="small" @click="$refs.show4.hide()">取消</el-button>
        <el-button type="primary" size="small" @click="$refs.show4.hide()">确认</el-button>
      </template>
    </Popup>
  </div>
</template>

<script>
import Popup from "@/components/popup/index";
export default {
  name: "tVSwitch",
  components: { Popup },
  data() {
    return {
      visible: {
        show1: false,
        show2: false,
        show3: false,
        show4: false,
      },
    };
  },
};
</script>