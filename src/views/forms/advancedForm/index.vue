<template>
  <div class="advanced-form-warp">
    <el-card>
      <div slot="header">
        <span>采购开单</span>
      </div>
      <div class="advanced-title">基本信息</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" size="small">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="供应商：" prop="a1">
              <el-cascader :options="options" :props="{ checkStrictly: true,expandTrigger: 'hover' }" clearable
                placeholder="请选择供应商" v-model="ruleForm.a1" style="width:100%;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货仓库：" prop="a2">
              <el-select v-model="ruleForm.a2" placeholder="请选择收货仓库" style="width:100%;">
                <el-option label="一致" value="一致"></el-option>
                <el-option label="反馈" value="反馈"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="到货时间：" prop="a3">
              <el-date-picker type="date" placeholder="选择到货时间" v-model="ruleForm.a3" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人：" prop="a4">
              <el-input v-model="ruleForm.a4" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话：" prop="a5">
              <el-input v-model="ruleForm.a5" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮资：" prop="a6">
              <el-input v-model="ruleForm.a6" placeholder="请输入邮资"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称：" prop="a7">
              <el-input v-model="ruleForm.a7" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注：" prop="a8">
              <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" placeholder="请输入备注" v-model="ruleForm.a8">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="advanced-title mb20">采购列表</div>
      <el-table :data="tableData.data" stripe v-loading="tableData.loading">
        <el-table-column prop="a1" label="sku编码"></el-table-column>
        <el-table-column prop="a2" label="商品名称"></el-table-column>
        <el-table-column prop="a3" label="规格"></el-table-column>
        <el-table-column prop="a4" label="采购数量">
          <template slot-scope="scope">
            <el-input size="small" placeholder="输入采购数量" v-model="scope.row.a4"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="a5" label="采购价">
          <template slot-scope="scope">
            <el-input size="small" placeholder="输入采购价" v-model="scope.row.a5"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="onHandleDel(scope.$index,scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="onAddCellTable" size="small" icon="el-icon-plus" class="mt20" style="width:100%;">添加采购
      </el-button>
    </el-card>
    <el-card class="table-bottom mt15">
      <el-button size="small" type="primary" @click="submitForm('ruleForm')" icon="el-icon-shopping-cart-1">提交采购数据
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { options } from './mock'
export default {
  name: 'advancedForm',
  data() {
    return {
      options,
      ruleForm: {
        a1: '',
        a2: '',
        a3: '',
        a4: '',
        a5: '',
        a6: '',
        a7: '',
        a8: '',
      },
      rules: {
        a1: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        a2: [{ required: true, message: '请选择收货仓库', trigger: 'change' }],
        a3: [{ type: 'date', required: true, message: '选择到货时间', trigger: 'change' }],
        a4: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        a5: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        a6: [{ required: true, message: '请输入邮资', trigger: 'blur' }],
        a7: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      },
      tableData: {
        data: [],
        total: 99,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      }
    }
  },
  mounted() {
    this.getTabelData();
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm, this.tableData.data)
          console.log(params)
        } else {
          return false;
        }
      });
    },
    // 模拟表格数据
    getTabelData() {
      this.tableData.loading = true;
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          this.tableData.data.push({
            a1: Math.floor(Math.random() * 100000000),
            a2: `好滋好味鸡蛋仔${i + 1}`,
            a3: '甜味，大包',
            a4: '',
            a5: ''
          })
        }
        this.tableData.loading = false;
      }, 300);
    },
    // 删除当前行
    onHandleDel(index, row) {
      this.$confirm('删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.data.splice(index, 1)
      }).catch(() => { })
    },
    // 添加行
    onAddCellTable() {
      this.tableData.data.push({
        a1: Math.floor(Math.random() * 100000000),
        a2: `好滋好味鸡蛋仔${this.tableData.data.length + 1}`,
        a3: '甜味，大包',
        a4: '',
        a5: ''
      })
    }
  }
}
</script>

<style scoped lang="scss">
.advanced-form-warp {
  ::v-deep .el-card__body {
    padding: 15px !important;
    .advanced-title {
      color: #09f;
      position: relative;
      padding-left: 10px;
      &::after {
        content: "";
        width: 2px;
        height: 14px;
        background: #09f;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        border-radius: 3px;
      }
    }
    .demo-ruleForm {
      padding: 40px 25px 20px 0;
    }
  }
  .table-bottom {
    text-align: center;
    ::v-deep .el-card__body {
      padding: 15px !important;
    }
  }
}
</style>