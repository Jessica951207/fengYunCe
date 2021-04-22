<template>
  <div class="steps-three">
    <div class="steps-three-info">
      <i class="el-icon-success"></i>
      <div class="steps-three-info-title">转账成功</div>
      <div class="steps-three-info-dec">预计两小时内到账</div>
    </div>
    <div class="steps-three-box">
      <div class="steps-three-box-item">
        <div class="steps-three-box-label">付款账户：</div>
        <div class="steps-three-box-value">{{ruleForm.a1}}</div>
      </div>
      <div class="steps-three-box-item">
        <div class="steps-three-box-label">收款账户：</div>
        <div class="steps-three-box-value">{{ruleForm.a3}}</div>
      </div>
      <div class="steps-three-box-item">
        <div class="steps-three-box-label">收款人姓名：</div>
        <div class="steps-three-box-value">{{ruleForm.a4}}</div>
      </div>
      <div class="steps-three-box-item">
        <div class="steps-three-box-label">转账金额：</div>
        <div class="steps-three-box-value">{{ruleForm.a5}}元</div>
      </div>
    </div>
    <div class="steps-three-btn">
      <el-button type="primary" @click="submitForm" class="mt20" size="small">继续转账</el-button>
      <el-button size="small">查看账单</el-button>
    </div>
  </div>
</template>

<script>
import { getSession, removeSession } from '@/utils/storage'
export default {
  name: 'stepsThree',
  data() {
    return {
      ruleForm: {}
    }
  },
  mounted() {
    this.initRuleForm()
  },
  methods: {
    // 初始化表单
    initRuleForm() {
      if (getSession('stepsOne')) {
        this.ruleForm = getSession('stepsOne')
        console.log(this.ruleForm)
      }
    },
    // 继续提交
    submitForm() {
      removeSession('stepsOne')
      this.$emit('setActive', 0)
    }
  }
}
</script>

<style scoped lang="scss">
.steps-three {
  max-width: 530px;
  margin: 50px auto 0;
  .steps-three-info {
    text-align: center;
    i {
      font-size: 70px;
      color: #67c23a;
    }
    .steps-three-info-title {
      font-size: 20px;
      color: #333333;
      margin: 20px 0 10px;
    }
    .steps-three-info-dec {
      font-size: 14px;
      color: #8c8c8c;
    }
  }
  .steps-three-box {
    background: #f8f8f8;
    margin-top: 20px;
    padding: 30px;
    .steps-three-box-item {
      margin-bottom: 20px;
      display: flex;
      &:last-of-type {
        margin-bottom: 0;
      }
      .steps-three-box-label {
        width: 120px;
        color: #8c8c8c;
      }
      .steps-three-box-value {
        flex: 1;
        color: #8c8c8c;
      }
    }
  }
  .steps-three-btn {
    text-align: center;
  }
}
</style>