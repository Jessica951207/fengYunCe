<template>
  <el-dialog title="个人设置" :visible.sync="dialogVisible" width="800px" v-drag-dialog append-to-body>
    <div style="max-height: 520px;overflow: auto;">
      <el-scrollbar style="height:100%;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="即时配送" prop="delivery">
            <el-switch v-model="ruleForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc" :autosize="{ minRows: 3}" maxlength="520"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')" size="small">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" size="small">确认修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "homeUserSetDialog",
  data() {
    return {
      ruleForm: {
        name: "",
        region: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      dialogVisible: false,
    };
  },
  methods: {
    // 打开
    open() {
      this.dialogVisible = true;
    },
    // 关闭
    close() {
      this.dialogVisible = false;
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.close();
          this.$message.success("更新成功");
        } else {
          return false;
        }
      });
    },
    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.close();
    },
  },
};
</script>

