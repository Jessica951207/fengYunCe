<template>
  <div class="user-role-warp" :style="styleHeight">
    <div class="user-role-warp-box" ref="userRoleWarpBoxRef">
      <el-form :inline="true" :model="Form" ref="Form" size="small">
          <el-form-item label="机构" prop="chooseMenus">
              <el-cascader
                      v-model="Form.chooseMenus"
                      :options="options"
                      :props="props"
                      clearable
                      collapse-tags
                      style="width: 100%"></el-cascader>
          </el-form-item>
          <el-form-item label="信息类型" prop="chooseMenus">
              <el-cascader
                      v-model="Form.chooseMenus"
                      :options="options"
                      :props="props"
                      clearable
                      collapse-tags
                      style="width: 100%"></el-cascader>
          </el-form-item>
          <el-form-item label="变量类型" prop="chooseMenus">
              <el-cascader
                      v-model="Form.chooseMenus"
                      :options="options"
                      :props="props"
                      clearable
                      collapse-tags
                      style="width: 100%"></el-cascader>
          </el-form-item>
          <el-form-item label="变量名称">
              <el-input v-model="Form.user" placeholder="请输入变量名称"></el-input>
          </el-form-item>
          <el-form-item label="对应字段">
              <el-input v-model="Form.user" placeholder="请输入对应字段"></el-input>
          </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <!--<el-button type="info" icon="el-icon-refresh-left" @click="onReset">重置</el-button>-->
          <el-button type="success" icon="el-icon-plus" @click="addMenu">添加菜单</el-button>
            <el-button type="warning" icon="el-icon-d-caret" @click="onReset">决策树</el-button>
        </el-form-item>
      </el-form>
        <el-table :data="tableData.data" border row-key="meta.title" :tree-props="{children: 'children'}"
                  :max-height="tableHeight" v-loading="tableData.loading">
            <el-table-column prop="meta.title" label="菜单名称"></el-table-column>
            <el-table-column prop="meta.icon" label="图标">
                <template slot-scope="scope">
                    <i :class="scope.row.meta.icon"></i>
                </template>
            </el-table-column>
            <el-table-column prop="componentPath" label="组件路径"></el-table-column>
            <el-table-column prop="meta.hidden" label="菜单状态">
                <template slot-scope="scope">
                    {{scope.row.meta.hidden ? '隐藏' : '显示'}}
                </template>
            </el-table-column>
            <el-table-column prop="parentPath" label="上级路由"></el-table-column>
            <el-table-column prop="meta.parent" label="顶级路由"></el-table-column>
            <el-table-column prop="path" label="路由地址">
                <template slot-scope="scope">
                    {{scope.row.redirect ? scope.row.redirect : scope.row.path}}
                </template>
            </el-table-column>
            <el-table-column prop="meta.isExternalLinks" label="是否外链">
                <template slot-scope="scope">
                    {{scope.row.meta.isExternalLinks ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column prop="meta.externalLinkUrl" label="外链地址" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.meta.externalLinkUrl ? scope.row.meta.externalLinkUrl : ''}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="onCellEditMenu(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="onCellDelMenu(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <AddMenu ref="addMenuRef" />
    <EditMenu ref="editMenuRef" />
  </div>
</template>

<script>
import AddMenu from './component/addMenu'
import EditMenu from './component/editMenu'
export default {
  name: 'userRole',
  components: {
    AddMenu,
    EditMenu
  },
  data() {
    return {
      tableHeight: 0,
        Form: {},
      tableData: {
        data: [],
        loading: true
      },
        props: { multiple: true },
        options:[]
    }
  },
  computed: {
    // 动态高度，适配各布局。单页面的画，高度设为100%即可。
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
    this.setTableHeight()
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.tableData.loading = true
      this.tableData.data = this.$store.state.primeMenuData
      setTimeout(() => {
        this.tableData.loading = false
      }, 500)
    },
    // 表格高度
    setTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = `${this.$refs.userRoleWarpBoxRef.clientHeight - 51 - 30}px`
      })
    },
    // 查询
    onSearch() { },
    // 重置
    onReset() { },
    // 新增
    addMenu() {
      this.$refs.addMenuRef.open(this.$store.state.primeMenuData)
    },
    // 表格行菜单修改
    onCellEditMenu(row) {
      this.$refs.editMenuRef.open(this.$store.state.primeMenuData, row)
    },
    // 表格行菜单删除
    onCellDelMenu(row) {
      this.$confirm(`此操作将删除名称为"${row.meta.title}"的数据项, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功！')
        this.getTableData()
      }).catch(() => { })
    }
  }
};
</script>

<style scoped lang="scss">
.user-role-warp {
  border-radius: 0px;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  .user-role-warp-box {
    padding: 15px;
    height: 100%;
    border: 1px solid #ebeef5;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03) !important;
  }
}
</style>
