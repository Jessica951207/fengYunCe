<template>
  <div>
    <template v-for="(val, key) in chil">
      <el-submenu :index="val[props.index]" :key="key" v-if="val[props.children] && val[props.children].length > 0">
        <template slot="title">
          <i :class="val.meta.icon"></i>
          {{ val[props.label] }}
        </template>
        <sub-item :chil="val[props.children]" :props="props" @getSubItem="onSubTtemClick" />
      </el-submenu>
      <el-menu-item :index="val[props.index]" v-else :key="key" @click="onSubTtemClick(val)">
        <i :class="val.meta.icon"></i>
        {{ val[props.label] }}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "subItem",
  props: {
    chil: {
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
  methods: {
    // 当前菜单点击
    onSubTtemClick(item) {
      this.$emit("getSubItem", item);
    },
  },
};
</script>
