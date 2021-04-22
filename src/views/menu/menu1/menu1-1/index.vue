  <template>
  <div>
    <div>menu1-1</div>
    <el-input v-model="testVal" size="small" placeholder="测试路由缓存"></el-input>
  </div>
</template>

<script>
export default {
  name: 'menu11',
  data() {
    return {
      testVal: ''
    }
  },
  // 缓存路由使用生命周期进行初始化数据等
  activated() { },
  deactivated() { }
}
</script>
</template>

