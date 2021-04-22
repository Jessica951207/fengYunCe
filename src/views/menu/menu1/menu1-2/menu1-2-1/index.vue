<template>
  <div>
    <div>menu1-2-1</div>
    <el-input v-model="testVal" size="small" placeholder="路由不缓存"></el-input>
  </div>
</template>

<script>
export default {
  name: 'menu121',
  data() {
    return {
      testVal: ''
    }
  },
  // 不缓存的路由使用
  mounted() {
    console.log('menu121不缓存：mounted(){}')
  }
}
</script>