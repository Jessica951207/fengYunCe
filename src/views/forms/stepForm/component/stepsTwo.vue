<template>
  <div class="steps-two">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" size="small">
      <el-form-item label="付款账户：">
        <el-select v-model="ruleForm.a1" placeholder="请选择付款账户" style="width:100%;" disabled>
          <el-option label="1105290566@qq.com" value="1105290566@qq.com"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款账户：">
        <el-input placeholder="请输入收款账户" v-model="ruleForm.a3" readonly>
          <el-select v-model="ruleForm.a2" slot="prepend" placeholder="请选择" style="width:90px;" disabled>
            <el-option label="支付宝" value="1"></el-option>
            <el-option label="微信" value="2"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="收款人姓名：">
        <el-input v-model="ruleForm.a4" placeholder="请输入收款人姓名" readonly></el-input>
      </el-form-item>
      <el-form-item label="转账金额：">
        <el-input v-model="ruleForm.a5" placeholder="请输入转账金额" readonly></el-input>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="支付密码：" prop="a6">
        <el-input v-model="ruleForm.a6" placeholder="请输入支付密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" class="mt20" :loading="submitLoading">提交</el-button>
        <el-button @click="onBackStepsOne">上一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSession } from '@/utils/storage'
export default {
  name: 'stepsTwo',
  data() {
    return {
      ruleForm: {
        a1: '',
        a2: '1',
        a3: '',
        a4: '',
        a5: '',
        a6: ''
      },
      rules: {
        a6: [{ required: true, message: '请输入支付密码', trigger: 'change' }]
      },
      submitLoading: false
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
      }
    },
    // 返回上一步
    onBackStepsOne() {
      this.$emit('setActive', 0)
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            this.$emit('setActive', 3)
            this.submitLoading = false
          }, 1000)
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
.steps-two {
  max-width: 530px;
  margin: 50px auto 0;
}
</style>