<template>
  <div>
    <div>menu1-2-2</div>
    <el-input v-model="testVal" size="small" placeholder="测试路由缓存"></el-input>
  </div>
</template>

<script>
export default {
  name: 'menu122',
  data() {
    return {
      testVal: ''
    }
  },
  // 缓存路由使用生命周期进行初始化数据等
  activated() {
    console.log('menu122缓存路由：activated(){}')
  },
  deactivated() { }
}
</script>