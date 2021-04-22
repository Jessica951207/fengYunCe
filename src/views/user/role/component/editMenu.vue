<template>
  <div class="user-role-edit-dialog">
    <el-dialog title="修改菜单" :visible.sync="visible" width="800px" v-drag-dialog append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="small">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="superMenuDataId">
              <el-cascader :options="superMenuData"
                :props="{ checkStrictly: true,expandTrigger: 'hover',value:'path',label:'title' }" clearable
                placeholder="选择挂载到哪个根菜单下，不填默认创建最顶级菜单" style="width:100%;" v-model="ruleForm.superMenuDataId"
                @change="onSuperMenuDataChange">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.title" label="菜单名称">
              <el-input v-model="ruleForm.meta.title" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.icon" label="菜单图标">
              <el-input v-model="ruleForm.meta.icon" placeholder="请选择菜单图标" @focus="$refs.iconZoomRef.open()"
                :prefix-icon="ruleForm.meta.icon" @blur="$refs.iconZoomRef.close()"></el-input>
              <IconZoom ref="iconZoomRef" @sendIcon="onSendIcon" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="component" label="组件路径">
              <el-input v-model="ruleForm.component" placeholder="前面不带'/'，如：layout/publics"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.hidden" label="菜单状态">
              <el-select v-model="ruleForm.meta.hidden" placeholder="请选择是否显示在左侧导航中" style="width:100%;">
                <el-option label="显示" :value="false"></el-option>
                <el-option label="隐藏" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="parentPath" label="上级路由">
              <el-input v-model="ruleForm.parentPath" placeholder="前面带'/'，breadcrumb面包屑递归使用" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.parent" label="顶级路由">
              <el-input v-model="ruleForm.meta.parent" placeholder="前面带'/'，strange布局菜单高亮使用" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="path" label="路由地址">
              <el-input v-model="ruleForm.path" placeholder="前面带'/'，请输入路由地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sort" label="菜单排序">
              <el-input-number v-model="ruleForm.sort" controls-position="right" placeholder="请输入数字"
                style="width:100%;">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.isExternalLinks" label="是否外链">
              <el-radio-group v-model="ruleForm.meta.isExternalLinks" @change="onExternalLinksChange">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="ruleForm.meta.isExternalLinks ? 'meta.externalLinkUrl' : ''" label="外链地址">
              <el-input v-model="ruleForm.meta.externalLinkUrl" placeholder="请输入外链地址"
                :readonly="ruleForm.meta.isExternalLinks ? false : true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.externalLinkType" label="外链类型">
              <el-input v-model="ruleForm.meta.externalLinkType" placeholder="外链打开类型，自动添加" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="meta.affix" label="是否固定">
              <el-switch v-model="ruleForm.meta.affix" :disabled="ruleForm.superMenuDataId.length <= 0 ? false : true">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="onResetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" size="small" @click="onSubmitForm('ruleForm')">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IconZoom from './iconZoom'
import { dragDialog } from "@/utils/directive"
export default {
  name: 'userRoleEditDialog',
  components: { IconZoom },
  data() {
    return {
      visible: false,
      ruleForm: {
        superMenuDataId: [], // 上级菜单的 id 值
        component: '', // 组件路径
        parentPath: '', // 上级路由
        path: '', // 路由地址
        sort: undefined, // 菜单排序
        meta: {
          title: '', // 菜单名称
          icon: '', // 菜单图标
          hidden: false, // 菜单是否隐藏
          isExternalLinks: false, // 是否外链
          externalLinkUrl: '', // 外链地址
          externalLinkType: '', // 外链打开类型，之前为了内容内打开（组件例子/大数据可视化）/ 外打开（外链），所以加了这个属性
          affix: false // 是否固定在tagview中
        }
      },
      rules: {
        'superMenuDataId': [{ required: false, message: '请选择上级菜单', trigger: 'change' }],
        'meta.title': [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        'meta.icon': [{ required: true, message: '请选择菜单图标', trigger: 'change' }],
        'component': [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        'meta.hidden': [{ required: true, message: '请选择菜单是否隐藏', trigger: 'blur' }],
        'parentPath': [{ required: false, message: '请输入上级路由', trigger: 'blur' }],
        'meta.parent': [{ required: false, message: '请输入顶级路由', trigger: 'blur' }],
        'path': [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        'sort': [{ required: false, message: '请输入数字', trigger: 'blur' }],
        'meta.isExternalLinks': [{ required: true, message: '请选择是否外链', trigger: 'blur' }],
        'meta.externalLinkUrl': [{ required: true, message: '请输入外链地址', trigger: 'blur' }],
        'meta.externalLinkType': [{ required: false, message: '外链打开类型，自动添加', trigger: 'blur' }],
      },
      superMenuData: [],
    }
  },
  created() {
    dragDialog()
  },
  methods: {
    // 打开弹窗
    open(menu, row) {
      this.superMenuData = this.filterMenu(menu)
      this.visible = true
      // 当前点击项数据
      console.log(row)
      // 数据回显
      this.ruleForm.superMenuDataId = row.superMenuDataId ? row.superMenuDataId : []
      this.ruleForm.component = row.component
      this.ruleForm.parentPath = row.parentPath
      this.ruleForm.componentPath = row.componentPath
      this.ruleForm.path = row.path
      this.ruleForm.sort = row.sort
      this.ruleForm.meta.title = row.meta.title
      this.ruleForm.meta.icon = row.meta.icon
      this.ruleForm.meta.hidden = row.meta.hidden
      this.ruleForm.meta.isExternalLinks = row.meta.isExternalLinks
      this.ruleForm.meta.externalLinkUrl = row.meta.externalLinkUrl
      this.ruleForm.meta.externalLinkType = row.meta.externalLinkType
      this.ruleForm.meta.affix = row.meta.affix
    },
    // 关闭弹窗
    close() {
      this.visible = false
    },
    // 修改
    onSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.close()
          console.log(this.ruleForm)
        } else {
          return false;
        }
      });
    },
    // 取消
    onResetForm(formName) {
      this.$refs[formName].resetFields()
      this.close()
    },
    // 上级菜单改变
    onSuperMenuDataChange() {
      let ids = this.ruleForm.superMenuDataId
      if (ids.length > 0) {
        this.ruleForm.meta.parent = ids[0]
        this.ruleForm.parentPath = ids[ids.length - 1]
        this.ruleForm.meta.affix = false
      }
    },
    // 是否外链改变
    onExternalLinksChange() {
      this.ruleForm.meta.externalLinkType = this.ruleForm.meta.isExternalLinks ? 'opne' : ''
    },
    // 获取子组件当前点击值
    onSendIcon(icon) {
      this.ruleForm.meta.icon = icon
    },
    // 菜单格式处理
    filterMenu(arr) {
      return arr.map((item) => {
        item["title"] = item.meta.title;
        item = Object.assign({}, item);
        if (item.children) item.children = this.filterMenu(item.children)
        return item;
      });
    }
  }
}
</script>