<template>
  <div>
    <el-card class="tree-card" shadow="never">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="商品名称" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="商品 ID">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSelect">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <div v-loading="loading">
        <div class="tree-head">
          <div class="tree-head-check">
            <el-checkbox v-model="checkAll" @change="onCheckAllChange"></el-checkbox>
          </div>
          <div class="tree-head-one">商品 ID</div>
          <div class="tree-head-flex">
            <div class="tree-head-two">商品名称</div>
            <div class="tree-head-three">描述</div>
          </div>
        </div>
        <el-tree :data="treeData" show-checkbox node-key="id" ref="treeTable" :props="treeDefaultProps"
          @check="onCheckTree">
          <span class="tree-custom-node" slot-scope="{ node, data }">
            <span style="flex: 1">{{ node.label }}</span>
            <span v-if="data.isShow" style="flex: 1; display: flex">
              <span type="text" size="mini" style="flex: 1">{{
                data.label1
              }}</span>
              <span type="text" size="mini" style="flex: 1">{{
                data.label2
              }}</span>
            </span>
          </span>
        </el-tree>
      </div>
      <el-pagination style="text-align: right; margin-top: 15px" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :page-sizes="[10, 20, 30]" :current-page="tableData.param.pageNum"
        :page-size="tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { treeMockData } from "./mock";
export default {
  name: "treeControl",
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      checkAll: false,
      loading: false,
      treeData: [],
      treeDefaultProps: {
        children: "children",
        label: "label",
      },
      treeSelArr: [],
      treeLength: 0,
      tableData: {
        total: 99,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    // 初始化树的长度
    initTreeLengh(arr) {
      let count = 0;
      arr.map((item) => {
        if (item.children) {
          count += item.children.length;
        }
      });
      this.treeLength = count + arr.length;
    },
    // 全选改变时
    onCheckAllChange() {
      if (this.checkAll) {
        this.$refs.treeTable.setCheckedNodes(this.treeData);
      } else {
        this.$refs.treeTable.setCheckedKeys([]);
      }
    },
    // 节点选中状态发生变化时的回调
    onCheckTree() {
      this.treeSelArr = [];
      this.treeSelArr = this.$refs.treeTable.getCheckedNodes();
      this.treeSelArr.length == this.treeLength
        ? (this.checkAll = true)
        : (this.checkAll = false);
    },
    // 选择元素按钮
    onSelect() {
      let treeArr = this.$refs.treeTable.getCheckedNodes();
      if (treeArr.length <= 0) {
        this.$message.warning("请选择商品");
        return;
      } else {
        console.log(this.$refs.treeTable.getCheckedNodes());
      }
    },
    // 获取数据
    getTreeData() {
      this.treeData = treeMockData;
      this.initTreeLengh(this.treeData);
    },
    // pageSize
    handleSizeChange(val) {
      this.tableData.param.pageSize = val;
    },
    // pageNum
    handleCurrentChange(val) {
      this.tableData.param.pageNum = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-card {
  height: 100%;
  background-color: #ffffff;
  padding: 15px;
  ::v-deep .el-card__body {
    padding: 0 !important;
    .tree-head {
      line-height: 47px;
      height: 47px;
      border: 1px solid #ebeef5;
      border-bottom: none;
      display: flex;
      font-size: 14px;
      padding-right: 8px;
      color: #909399;
      .tree-head-check {
        width: 38px;
        text-align: right;
      }
      .tree-head-one {
        flex: 1;
        padding-left: 8px;
        font-weight: 600;
      }
      .tree-head-flex {
        flex: 1;
        display: flex;
        .tree-head-two,
        .tree-head-three {
          flex: 1;
          font-weight: 600;
        }
      }
    }
    .el-tree {
      overflow: hidden;
      border-bottom: 1px solid #ebeef5;
      .tree-custom-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
      .el-tree-node {
        border: 1px solid #ebeef5;
        border-bottom: none;
      }
      .el-tree-node__children .el-tree-node {
        border: none;
      }
      .el-tree-node__content {
        line-height: 47px !important;
        height: 47px !important;
      }
      .el-tree-node__children .el-tree-node__content {
        border-top: 1px solid #ebeef5;
      }
      .el-tree-node:focus > .el-tree-node__content {
        background-color: transparent;
      }
      .el-tree-node__content:hover {
        background-color: #f5f7fa !important;
      }
    }
  }
}
</style>