<template>
  <div class="step-form-warp" :style="styleHeight">
    <div class="step-form-warp-box">
      <el-steps :active="stepsActive" align-center finish-status="success">
        <el-step title="填写转账信息"></el-step>
        <el-step title="确认转账信息"></el-step>
        <el-step title="完成转账"></el-step>
      </el-steps>
      <StepsOne v-if="stepsActive === 0" @setActive="onSetActive" />
      <StepsTwo v-else-if="stepsActive === 1" @setActive="onSetActive" />
      <StepsThree v-else-if="stepsActive === 3" @setActive="onSetActive" />
    </div>
  </div>
</template>

<script>
import StepsOne from './component/stepsOne'
import StepsTwo from './component/stepsTwo'
import StepsThree from './component/stepsThree'
export default {
  name: 'stepForm',
  components: {
    StepsOne,
    StepsTwo,
    StepsThree
  },
  data() {
    return {
      stepsActive: 0
    }
  },
  methods: {
    // 设置完成步骤
    onSetActive(num) {
      this.stepsActive = num
    }
  },
  computed: {
    // 动态高度，适配各布局。单页面的画，高度设为100%即可。
    styleHeight() {
      let { layout, isTagsView } = this.$store.state.layoutConfig;
      if (layout === 'fashion' || layout === 'strange') {
        if (isTagsView) {
          return {
            height: `calc(100vh - 114px)`
          }
        } else {
          return {
            height: `calc(100vh - 80px)`
          }
        }
      } else {
        return {
          height: `calc(100vh - 80px)`
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.step-form-warp {
  border-radius: 0px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: auto;
  color: #303133;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03) !important;
  margin: 15px;
  .step-form-warp-box {
    max-width: 1000px;
    margin: 30px auto;
    ::v-deep .el-step__title.is-process {
      color: #09f !important;
      font-weight: normal !important;
    }
    ::v-deep .el-step__head.is-process {
      color: #09f !important;
      border-color: #09f !important;
    }
    ::v-deep .is-success {
      .el-step__line {
        background-color: #67c23a !important;
      }
    }
  }
}
</style>