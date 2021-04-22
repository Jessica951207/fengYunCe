<template>
  <div class="table-warp" :style="styleHeight">
    <input type="file" id="fileXlsx" style="display:none;" />
    <el-card class="table-top">
      <el-form :inline="true" :model="ruleForm" class="demo-form-inline" size="small">
        <el-form-item label="文件名称">
          <el-input v-model="ruleForm.fileName" placeholder="输入导出文件名称"></el-input>
        </el-form-item>
        <el-form-item label="导出类型">
          <el-select v-model="ruleForm.fileType" placeholder="请选择导出类型">
            <el-option label="xls" value="xls"></el-option>
            <el-option label="xlsb" value="xlsb"></el-option>
            <el-option label="xlsx" value="xlsx"></el-option>
            <el-option label="csv" value="csv"></el-option>
            <el-option label="pdf" value="pdf"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="onExport" :loading="exportLoading">导出</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="onImport" :loading="exportLoading">导入</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="onReset" :loading="exportLoading">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-center" ref="tablesCardRef">
      <el-table :data="tableData.data" stripe v-loading="tableData.loading" element-loading-text="拼命加载中" ref="tablesRef"
        id="tablesRef" style="width: 100%" :max-height="tableHeight">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="date" label="日期"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="onHandleCellClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="table-bottom">
      <el-pagination style="text-align: right;" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :page-sizes="[10, 20, 30]" :current-page="tableData.param.pageNum"
        :page-size="tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { tableList } from './mock'
import { exportCsv, exportXLsx, exportPdf } from './export'
import { importXlsx } from './import'
export default {
  name: 'tables',
  data() {
    return {
      exportLoading: false,
      tableHeight: 0,
      ruleForm: {
        fileName: '',
        fileType: 'xls'
      },
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    }
  },
  computed: {
    // 动态高度，适配各布局。单页面的话，高度设为100%即可。
    styleHeight() {
      let { layout, isTagsView } = this.$store.state.layoutConfig;
      if (layout === 'fashion' || layout === 'strange') {
        if (isTagsView) {
          return {
            height: `calc(100vh - 84px)`
          }
        } else {
          return {
            height: `calc(100vh - 50px)`
          }
        }
      } else {
        return {
          height: `calc(100vh - 50px)`
        }
      }
    }
  },
  mounted() {
    this.setTableHeight();
    this.getTabelData();
  },
  methods: {
    // 导出点击
    onExport() {
      this.exportLoading = true;
      if (this.ruleForm.fileType === 'csv') {
        // 标题头格式
        let header = [{ date: '日期' }, { name: '姓名' }, { address: '地址' }, { goodsName: '商品名称' }, { desc: '描述' }];
        // 文件名称
        let fileName = this.ruleForm.fileName === '' ? 'exportCsv' : this.ruleForm.fileName;
        // 调用导出方法
        exportCsv(this.tableData.data, header, fileName);
      } else if (this.ruleForm.fileType === 'xls' || this.ruleForm.fileType === 'xlsb' || this.ruleForm.fileType === 'xlsx') {
        // 标题头格式
        let header = [{ date: '日期' }, { name: '姓名' }, { address: '地址' }, { goodsName: '商品名称' }, { desc: '描述' }];
        // 文件名称
        let fileName = this.ruleForm.fileName === '' ? 'vue-admin-wonderful' : this.ruleForm.fileName;
        exportXLsx(this.tableData.data, header, this.ruleForm.fileType, fileName);
      } else if (this.ruleForm.fileType === 'pdf') {
        // 文件名称
        let fileName = this.ruleForm.fileName === '' ? 'vue-admin-wonderful' : this.ruleForm.fileName;
        exportPdf(document.querySelector('#tablesRef'), fileName);
      }
      setTimeout(() => {
        this.exportLoading = false;
      }, 500)
    },
    // 导入点击
    onImport() {
      // 标题头格式
      let header = [{ date: '日期' }, { name: '姓名' }, { address: '地址' }, { goodsName: '商品名称' }, { desc: '描述' }];
      // 获取 input，触发上传
      let el = document.getElementById('fileXlsx');
      el.outerHTML = el.outerHTML; // 每次上传前清空之前的数据
      el.click();
      importXlsx(el, header, res => {
        this.tableData.data = res;
        this.tableData.total = res.length;
      });
    },
    // 表格高度
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = `${this.$refs.tablesCardRef.$el.clientHeight}px`;
      })
    },
    // 模拟表格数据
    getTabelData() {
      this.tableData.loading = true;
      setTimeout(() => {
        this.tableData.data = tableList;
        this.tableData.total = tableList.length;
        this.tableData.loading = false;
      }, 300);
    },
    // 重置点击
    onReset() {
      this.tableData.param.pageNum = 1;
      this.tableData.param.pageSize = 10;
      this.ruleForm.fileName = "";
      this.ruleForm.fileType = "xls";
      this.getTabelData();
    },
    // 查看点击
    onHandleCellClick(row) { },
    // 分页点击
    handleSizeChange(val) {
      this.tableData.param.pageSize = val;
    },
    // 分页点击
    handleCurrentChange(val) {
      this.tableData.param.pageNum = val;
    },
  }
}
</script>

<style scoped lang="scss">
.table-warp {
  display: flex;
  flex-direction: column;
  .table-top {
    padding: 10px;
    ::v-deep .el-form-item--small.el-form-item {
      margin-bottom: 0 !important;
    }
  }
  .table-center {
    flex: 1;
    display: flex;
    border-top: transparent;
    border-bottom: transparent;
    ::v-deep .el-card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
    }
  }
  .table-bottom {
    padding: 10px;
  }
}
</style>
