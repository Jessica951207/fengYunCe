<template>
  <div>
      <div id="decision_app" class="app-container">
          <el-row class="filter-container" style="padding-bottom: 10px;">
              <el-col :span="3">
                  <el-input v-model="listQuery.name" placeholder="决策流名称" clearable style="width: 200px;"
                            @keyup.enter.native="handleFilter"/>
              </el-col>
              <el-col :span="3">
                  <el-input v-model="listQuery.codename" placeholder="决策流代号" clearable style="width: 200px;"
                            @keyup.enter.native="handleFilter"/>
              </el-col>
              <el-col :span="3">
                  <el-select v-model="listQuery.productId" placeholder="所属产品" clearable style="width: 200px"
                             @change="handleFilter">
                      <el-option v-for="(value,key) in productOptions" :key="key" :label="value" :value="key"/>
                  </el-select>
              </el-col>
              <el-col :span="3">
                  <el-select v-model="listQuery.institutionId" placeholder="所属机构" clearable style="width: 200px"
                             @change="handleFilter">
                      <el-option v-for="(value,key) in institutionOptions" :key="key" :label="value"
                                 :value="key"/>
                  </el-select>
              </el-col>
              <el-col :span="3">
                  <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 200px"
                             @change="handleFilter">
                      <el-option v-for="(value,key) in statusOptions" :key="key" :label="value" :value="key"/>
                  </el-select>
              </el-col>
              <el-col :span="5">
                  <el-button  class="filter-item" type="primary" icon="el-icon-search"
                             @click="handleFilter">
                      搜索
                  </el-button>
                  <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                             @click="handleCreate()">
                      添加
                  </el-button>
                  <el-button class="iconfont icon-tree" style="margin-left: 10px;" type="primary"
                             @click="showDecisionTree()">
                      决策树
                  </el-button>
              </el-col>
          </el-row>
          <el-table :data="decisionList" style="width: 100%" border fit highlight-current-row
                    v-loading="listLoading">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="name" label="决策流名称" align="center"></el-table-column>
              <el-table-column prop="codename" label="决策流代号" align="center"></el-table-column>
              <el-table-column label="所属产品" align="center">
                  <template slot-scope="{row}">
                      <span>{{productOptions[row.productId]}}</span>
                  </template>
              </el-table-column>
              <el-table-column label="所属机构" align="center">
                  <template slot-scope="{row}">
                      <span>{{institutionOptions[row.institutionId]}}</span>
                  </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" align="center"></el-table-column>
              <el-table-column label="状态" align="center">
                  <template slot-scope="{row}">
                      <el-button :type="row.status==0?'success':'danger'" size="mini" @click="handleStatus(row)">
                          {{statusOptions[row.status]}}
                      </el-button>
                  </template>
              </el-table-column>
              <el-table-column label="运行锁" align="center">
                  <template slot-scope="{row}">
                      <el-button :type="row.runLock==1?'success':'danger'" size="mini"
                                 @click="handleRunLock(row)">
                          {{runLockOptions[row.runLock]}}
                      </el-button>
                  </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="250" align="center">
                  <template slot-scope="{row}">
                      <el-button @click="showNode(row)" type="primary" size="small">节点</el-button>
                      <el-button @click="handleUpdate(row)" type="primary" size="small">编辑</el-button>


                      <el-button @click="handleDelete(row)" type="danger" size="small">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>

          <el-pagination :v-show="total > 0" :total="total" :page.sync="listQuery.page"
                         :limit.sync="listQuery.limit" :page-sizes="[10, 20, 50, 100, 200]"
                         :page-size="10" background
                         layout="total, sizes, prev, pager, next, jumper"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange" style="margin-top: 10px"service
          ></el-pagination>
          <!--@pagination="getList" />-->

          <el-dialog :title="decisionDialogTitle" :visible.sync="decisionFormVisible"
                     :modal-append-to-body="false" :append-to-body="true" width="40%"
                     :before-close="handleDialogClose">
              <el-form :model="decisionTemp" :rules="decisionRules" ref="decisionForm" label-width="100px"
                       label-position="left">
                  <el-form-item label="决策流名称" prop="name">
                      <el-input v-model="decisionTemp.name" type="text" autocomplete="off" maxlength="20"
                                style="width: 400px" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item label="决策流代号" prop="codename">
                      <el-input v-model="decisionTemp.codename" type="text" autocomplete="off" maxlength="20"
                                style="width: 400px" show-word-limit></el-input>
                  </el-form-item>
                  <el-form-item label="所属产品" prop="productId">
                      <el-select v-model="decisionTemp.productId" placeholder="请选择产品">
                          <el-option v-for="(value,key) in productOptions" :key="key" :label="value"
                                     :value="key"/>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="所属机构" prop="institutionId">
                      <el-select v-model="decisionTemp.institutionId" placeholder="请选择机构">
                          <el-option v-for="(value,key) in institutionOptions" :key="key" :label="value"
                                     :value="key"/>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="是否启用">
                      <el-switch v-model="decisionTemp.status" :active-value=1 :inactive-value=0></el-switch>
                  </el-form-item>
                  <el-form-item label="提示语返回">
                      <el-switch v-model="decisionTemp.returnType" :active-value=1 :inactive-value=0></el-switch>
                  </el-form-item>
                  <el-form-item label="运行锁">
                      <el-switch v-model="decisionTemp.runLock" :active-value=1 :inactive-value=0></el-switch>
                  </el-form-item>
                  <el-form-item label="运行间隔">
                      <el-input-number v-model="decisionTemp.runInterval" :min="0" label="运行间隔"
                                       :disabled="decisionTemp.runLock!=1"
                                       style="width: 150px; margin-right: 10px">
                      </el-input-number>
                      天
                  </el-form-item>
                  <el-form-item label="备注">
                      <el-input v-model="decisionTemp.remark" type="textarea" :rows="2" placeholder="请输入内容"
                                style="width: 400px"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="showNode(decisionTemp)">配置节点</el-button>
                  <el-button @click="decisionFormVisible = false">取消</el-button>
                  <el-button type="primary" @click="handleSave(decisionTemp)">确认</el-button>
              </div>
          </el-dialog>
          <el-dialog :title="nodeTreeDialogTitle" :visible.sync="decisionNodeTreeVisible"
                     :modal-append-to-body="false" :append-to-body="true" width="70%"
                     custom-class="custom-dialog"  :fullscreen="isFullScreen" >
              <div id="nodeContainer" style="border: 1px solid #DCDFE6; position: relative"></div>
              <div slot="footer" class="dialog-footer">
                  <el-button type="success" @click="handleNodeTreeSave1()" plain>保存</el-button>
                  <el-button @click="fullScreen()" plain>全屏</el-button>

                  <el-button @click="IsFullNodeScreen()" plain>取消</el-button>
                  <el-button type="primary" @click="handleNodeTreeSave()" plain>确认</el-button>
              </div>
          </el-dialog>

          <el-dialog title=""
                     :visible.sync="delateDialogVisible"
                     :modal-append-to-body="false"
                     :append-to-body="true"
                     width="20%"
                     center
                     top="40vh">
              <span>请选择删除方式</span>
              <span slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="delateAllDialogVisible()" plain>删除当前节点及后续节点</el-button>
                    <el-button type="danger" @click="delateNowDialogVisible()" plain>删除当前节点</el-button>
                    </span>
          </el-dialog>





          <el-dialog :title="nodeDialogTitle" :visible.sync="decisionNodeVisible" :modal-append-to-body="false"
                     :append-to-body="true" width="35%" :before-close="handleDialogClose">
              <el-form :model="nodeTemp" :rules="nodeRules" ref="nodeForm" label-width="100px"
                       label-position="left" style="margin-left: 20px">
                  <el-form-item label="节点名称" prop="name">
                      <el-input v-model="nodeTemp.name" type="text" autocomplete="off" maxlength="20"
                                show-word-limit class="node-form"></el-input>
                  </el-form-item>
                  <el-form-item label="节点类型" prop="nodeType">
                      <el-select v-model="nodeTemp.nodeType" placeholder="节点类型" class="node-form" @change="conditionChange">
                          <el-option v-for="(value,key) in nodeTypeOptions" :key="key" :label="value"
                                     :value="key"/>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="条件" prop="conditionLeftOption">
                      <div v-if="nodeTemp.nodeType == 0">
                          <el-input v-model="nodeTemp.conditionLeftOption" type="text" autocomplete="off"
                                    class="node-form"></el-input>
                      </div>
                      <div v-if="nodeTemp.nodeType == 1">
                          <el-cascader v-model="nodeTemp.conditionLeftOption" :options="ruleGroupOptions"
                                       :props="{expandTrigger: 'hover'}"
                                       filterable clearable class="node-form">
                          </el-cascader>
                      </div>
                      <div v-if="nodeTemp.nodeType == 2">
                          <el-cascader v-model="nodeTemp.conditionLeftOption" :options="fieldCodeOptions"
                                       :props="{expandTrigger: 'hover'}"
                                       filterable clearable class="node-form">
                          </el-cascader>
                      </div>
                  </el-form-item>
                  <el-form-item label="条件操作" prop="conditionOperation">
                      <el-select v-model="nodeTemp.conditionOperation" placeholder="操作符" class="node-form">
                          <el-option v-if="nodeTemp.nodeType == 1"
                                     v-for="(value,key) in ruleGroupOperationOptions" :key="key" :label="value"
                                     :value="key">
                              <span style="float: left">{{ value }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ key }}</span>
                          </el-option>
                          <el-option v-if="nodeTemp.nodeType != 1" v-for="(value,key) in operationOptions" :key="key" :label="value"
                                     :value="key">
                              <span style="float: left">{{ value }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ key }}</span>
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="条件对比值" prop="conditionRight" v-if="nodeTemp.conditionOperation != 'pass'">
                      <div v-if="nodeTemp.nodeType == 1">
                          <el-select v-model="nodeTemp.conditionRight" placeholder="请选择">
                              <el-option
                                      v-for="item in booleanOptions"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                              </el-option>
                          </el-select>
                      </div>
                      <div v-else>
                          <div v-if="nodeTemp.conditionOperation == 'in' || nodeTemp.conditionOperation == 'not in'">
                              <el-row style="border: 1px #DCDFE6 solid; border-radius: 4px" class="node-form">
                                  <el-tag :key="tag" v-for="tag in nodeTemp.inOptions" closable
                                          :disable-transitions="false" @close="handleClose(tag)"
                                          style="margin-left: 10px">
                                      {{tag}}
                                  </el-tag>
                                  <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                            ref="saveTagInput" size="small"
                                            @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                                  </el-input>
                                  <el-button v-else class="button-new-tag" size="small" @click="showInput">添加包含值
                                  </el-button>
                              </el-row>
                          </div>
                          <div v-if="nodeTemp.conditionOperation == 'between'">
                              <el-input placeholder="minValue" v-model="nodeTemp.conditionRight"
                                        style="width: 120px"></el-input>
                              -
                              <el-input placeholder="maxValue" v-model="nodeTemp.maxValue"
                                        style="width: 120px"></el-input>
                          </div>
                          <div v-else>
                              <el-input v-model="nodeTemp.conditionRight" type="text" autocomplete="off"
                                        maxlength="20" class="node-form" show-word-limit></el-input>
                          </div>
                      </div>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="decisionNodeVisible = false">取消</el-button>
                  <el-button type="primary" @click="handleNodeSave(nodeTemp)">确认</el-button>
              </div>
          </el-dialog>

          <el-dialog title="决策流" :visible.sync="decisionTreeVisible" :modal-append-to-body="false"
                     :append-to-body="true" :fullscreen="isFullScreen"
                     width="85%" custom-class="custom-dialog">
              <div id="decisionTreeContainer" style="border: 1px solid #DCDFE6; position: relative; height: 100%"></div>
              <div slot="footer" class="dialog-footer" style="padding: 10px">
                  <el-button type="success" @Click="handleTreeSave1()" plain>保存 </el-button>
                  <el-button @click="fullScreen()" plain>全屏</el-button>
                  <el-button @click="pdfexport()" plain>导出</el-button>
                  <el-button type="danger" @click="IsfullTreeScreen()" plain>取消</el-button>
                  <el-button type="primary" @click="handleTreeSave()" plain>确认</el-button>
              </div>
          </el-dialog>

      </div>
  </div>
</template>

<script>
export default {
  name: 'menu2',
    data() {
        return {
            copy_id:'',
            new_node:'',
            decid:'',
            did:'',
            chi:'',
            chiLth:'',
            par:'',

            // 列表查询参数
            listQuery: {
                current: 1,
                size: 10,
                name: undefined,
                codename: undefined,
                status: undefined,
                productId: undefined,
                institutionId: undefined
            },
            institutionlength:0,
            // 列表总数
            total: 0,
            // 是否全屏
            isFullScreen: false,
            // 决策流弹窗标题
            decisionDialogTitle: '',
            // 决策树弹窗标题
            nodeTreeDialogTitle: '',
            // 节点弹窗标题
            nodeDialogTitle: '',
            // 弹窗可见状态
            decisionFormVisible: false,
            decisionNodeTreeVisible: false,
            decisionNodeVisible: false,
            decisionTreeVisible: false,
            delateDialogVisible:false,
            inputVisible: false,
            inputValue: '',
            // 节点树的容器ID
            nodeTreeId: 'nodeContainer',
            // 决策树的容器ID
            decisionTreeId: 'decisionTreeContainer',
            // 产品选项
            productOptions: {},
            // 机构选项
            institutionOptions: {

            },
            institutionOption:{
                id: null,
                name: ''
            },

            institutionOptionplus:[],

            // 规则组选项
            ruleGroupOptions: [],
            // 决策变量选项
            fieldCodeOptions: [],
            statusOptions: {0: '启用', 1: '禁止'},
            runLockOptions: {0: '关闭', 1: '开启'},
            nodeTypeOptions: {0: '其他', 1: '规则组', 2: '决策变量'},
            booleanOptions: ['true', 'false'],
            operationOptions: {
                "pass": "无条件通过",
                "==": "等于",
                "!=": "不等于",
                ">": "大于",
                ">=": "大于等于",
                "<": "小于",
                "<=": "小于等于",
                "in": "包含",
                "not in": "不包含",
                "between": "之间"
            },
            ruleGroupOperationOptions: {
                "pass": "无条件通过",
                "==": "等于",
                "!=": "不等于",
            },
            // 当前正在展示的图
            currentGraph: undefined,
            treeGraph: undefined,
            // 列表转圈圈
            listLoading: true,
            // 决策流临时表单数据
            decisionTemp: {},
            // 节点临时表单数据
            nodeTemp: {
                id: null,
                parentId: null,
                name: '',
                nodeType: '1',
                rank: 0,
                conditionLeft: '',
                conditionLeftOption: [],
                conditionOperation: '',
                conditionRight: '',
                inOptions: [],
                maxValue: '',
                area2:[],
                itsid:'',

            },

            //KEY 是类的id value是机构的id
            institutionMap:new Map(),


            // 规则组的Map，key为规则组的id
            ruleGroupMap: new Map(),
            // 决策变量的map，key为决策变量的id
            fieldCodeMap: new Map(),
            // 决策流列表
            decisionList: [],
            // 决策流表单校验规则
            decisionRules: {
                name: [{required: true, message: '请填写决策流', trigger: 'blur'}],
                productId: [{required: true, message: '请选择所属产品', trigger: 'change'}],
                institutionId: [{required: true, message: '请选择所属机构', trigger: 'change'}],
            },
            // 节点表单校验规则
            nodeRules: {
                name: [{required: true, message: '请填写节点名称', trigger: 'blur'}],
                nodeType: [{required: true, message: '请选择节点类型', trigger: 'change'}],
                conditionLeftOption: [{required: true, message: '请选择条件', trigger: 'change'}],
                conditionOperation: [{required: true, message: '请选择条件操作符', trigger: 'change'}],
                conditionRight: [{required: true, message: '请输入条件对比值', trigger: 'blur'}],
            },
        }
    },
    created: function () {
        let _this = this;
        // 初始化加载产品、机构等信息
        Promise.all([
            this.getProducts(),
            this.getInstitutions(),
            this.getRuleGroups(),
            this.getFieldCodes()
        ]).then(res => {
            _this.handleProducts(res[0]);
            _this.handleInstitutionsPlus(res[1]),_this.handleInstitutions(res[1]);
            _this.handleRuleGroups(res[2]);
            _this.handleFieldCodes(res[3]);
            _this.handleDecisions();
        });
    },
    methods: {
        /**
         * 处理产品列表
         * @returns {*}
         */
        getProducts() {
            // return service({
            //     url: `/product`,
            //     method: 'get'
            // })
        },
        handleProducts(data) {
            for (let x in data) {
                this.productOptions[x] = data[x].name;
            }
        },
        /**
         * 处理机构列表
         * @returns {*}
         */
        getInstitutions() {
            // return service({
            //     url: `/institution`,
            //     method: 'get'
            // })
        },
        handleInstitutions(data) {
            if (data.code === 0) {
                let institutionOption1=data.data;
                for(let x in institutionOption1){
                    this.institutionOptions[x]=institutionOption1[x].name;
                }
            }
        },
        /**
         *
         * 三级联动的机构列表获取 其中包含 id name pid(所属类的id)
         * */
        handleInstitutionsPlus(data) {

            if (data.code === 0) {
                this.institutionlength=0;
                data.data.forEach(type=>{
                    this.institutionlength++;
                    this.institutionOption={
                        id:null,
                        name:'',
                        pid:null
                    }
                    this.institutionOption.id=type.id;
                    this.institutionOption.name=type.name;
                    this.institutionOptionplus.push(this.institutionOption);
                })

            }

        },
        /**
         * 处理规则组列表
         * @returns {*}
         */
        getRuleGroups() {
            // return service({
            //     url: '/ruleGroup/map',
            //     method: 'get'
            // })
        },

        /**
         * 生成一个三级联动的数组 所有的下一级所需内容都存在children中
         * */
        handleRuleGroups(data) {
            if (data.code === 0) {
                let endoptions=[];
                let flag=0;
                let length=this.institutionlength;
                for (var i=0;i<length;i++)
                {   //institutionOptionplus是一个有所有机构列表的数组
                    var now= this.institutionOptionplus[i];
                    let endoption={
                        value: now.id.toString(),
                        label: now.name,
                        children:[]
                    };
                    data.data.forEach(type => {
                        let option = {
                            value: type.id.toString(),
                            label: type.name,
                            children: []
                        };
                        type.ruleGroupList.forEach(ruleGroup => {
                            let childOption = {
                                value: ruleGroup.id.toString(),
                                label: ruleGroup.name
                            };
                            //ruleGroupMap  institutionMap 方便后面构建节点的时候进行存取
                            //判断这个规则组所在的机构，如果是就把这个规则组所在的类加到机构列表中

                            if (ruleGroup.institution == endoption.value)
                            {   //如果使用ruleGroup.type进行存储的话由于type只有四个类型就会出现数据丢失的情况
                                this.ruleGroupMap.set(ruleGroup.id.toString(), ruleGroup);
                                this.institutionMap.set(ruleGroup.id.toString(),endoption.value);
                                option.children.push(childOption);
                                flag=1;
                            }
                        });
                        //如果符合要求的话就添加到数组中
                        if(flag==1) {
                            endoption.children.push(option);}
                        //变量归零
                        flag=0;

                    });
                    endoptions.push(endoption)
                }
                TreeGraph.prototype.ruleGroupMap = this.ruleGroupMap;
                this.ruleGroupOptions = endoptions;

            }
        },
        /**
         * 处理决策变量列表
         * @returns {*}
         */
        getFieldCodes() {
            // return service({
            //     url: '/msgType/map',
            //     method: 'get'
            // })
        },
        handleFieldCodes(data) {
            // if (data.code === 0) {
            //     let options = [];
            //     data.data.forEach(msg => {
            //         let option = {
            //             value: msg.tableName,
            //             label: msg.msgType,
            //             children: []
            //         };
            //         msg.fieldCodeList.forEach(fieldCode => {
            //             let childOption = {
            //                 value: fieldCode.id.toString(),
            //                 label: fieldCode.name
            //             };
            //             this.fieldCodeMap.set(fieldCode.id.toString(), fieldCode);
            //             option.children.push(childOption)
            //         });
            //         options.push(option)
            //     });
            //     TreeGraph.prototype.fieldCodeMap = this.fieldCodeMap;
            //     this.fieldCodeOptions = options;
            // }
        },
        /**
         * 获取决策流列表
         * @returns {*}
         */
        getDecisions() {
            this.listLoading = true;
            // return service({
            //     url: `/decision/page`,
            //     method: 'post',
            //     data: this.listQuery
            // });
        },
        handleDecisions() {
            this.getDecisions().then(res => {
                this.listLoading = false;
                if (res.code === 0) {
                    this.decisionList = res.data.records;
                    this.total = res.data.total;
                } else {
                    this.$message.error(`查询失败，失败原因：${res.msg}`);
                }
            });
        },
        /**
         * 决策流列表切换分页
         * @param val
         */
        handleCurrentChange(val) {
            this.listQuery.current = val;
            this.handleDecisions();
        },
        handleSizeChange(val) {
            this.listQuery.size = val;
            this.handleDecisions();
        },
        /**
         * 过滤决策流列表
         */
        handleFilter() {
            let _this = this;
            this.listQuery.page = 1;
            _this.handleDecisions();
        },
        /**
         * 清空临时表单
         */
        resetDecisionTemp() {
            this.decisionTemp = {
                id: '',
                name: '',
                codename: '',
                remark: '',
                status: 0,
                runLock: 0,
                runInterval: 30,
                returnType: 0
            }
        },
        resetNodeTemp(id, decisionId, operation, childrenId) {
            this.nodeTemp = {
                id: this.createUniqueString(),
                parentId: id,
                decisionId: !decisionId ? null : decisionId,
                name: '',
                nodeType: '1',
                conditionLeft: '',
                conditionLeftOption: undefined,
                conditionOperation: '',
                conditionRight: '',
                inOptions: [],
                operation: operation,
                childrenId: childrenId
            };
        },
        convertNodeTemp(model) {
            return {
                id: model.id,
                parentId: model.parentid,
                decisionId: model.decisionId,
                name: model.name,
                nodeType: model.nodeType,
                conditionLeft: model.conditionLeft,
                conditionLeftOption: model.conditionLeftOption,
                conditionOperation: model.conditionOperation,
                conditionRight: model.conditionRight,
                inOptions: model.inOptions,
                operation: model.operation,
                children: model.children
            };
        },
        /**
         * 创建决策流
         */
        handleCreate() {
            this.resetDecisionTemp();
            this.dialogTitle = "创建决策流";
            this.decisionFormVisible = true;
            this.$nextTick(() => {
                this.$refs['decisionForm'].clearValidate()
            })
        },
        /**
         * 修改决策流
         * @param row
         */
        handleUpdate(row) {

            this.decisionTemp = Object.assign({}, row);
            this.decisionTemp.productId = row.productId.toString();
            this.decisionTemp.institutionId = row.institutionId.toString();

            this.dialogTitle = "修改决策流";
            this.decisionFormVisible = true;
            this.$nextTick(() => {
                this.$refs['decisionForm'].clearValidate()
            })
        },
        /**
         * 删除决策流
         * @param row
         */
        handleDelete(row) {
            let _this = this;
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                // service({
                    // url: `/decision/${row.id}`,
                    // method: 'delete'
                // }).then(res => {
                //     if (res.code === 0) {
                //         this.$message({
                //             message: '删除成功',
                //             type: 'success'
                //         });
                //         _this.handleDecisions();
                //     } else {
                //         this.$message.error(`删除失败，失败原因：${res.msg}`);
                //     }
                // })
            }).catch()
        },
        /**
         * 保存决策流
         * @param data
         * @returns {*}
         */
        saveDecision(data) {
            // return service({
            //     url: `/decision`,
            //     method: 'post',
            //     data: data
            // })
        },
        handleSave(decisionTemp) {
            let _this = this;
            this.$refs['decisionForm'].validate((valid) => {
                if (valid) {
                    _this.saveDecision(decisionTemp).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                            _this.decisionFormVisible = false;
                        } else {
                            this.$message.error(`保存失败，失败原因：${res.msg}`);
                        }
                        _this.handleDecisions();
                    });
                }
            })
        },
        /**
         * 切换决策流状态
         * @param row
         */
        handleStatus(row) {
            let _this = this;
            this.$confirm('是否切换决策流状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(_ => {
                let temp = Object.assign({}, row);
                temp.status = row.status === 1 ? 0 : 1;
                _this.saveDecision(temp).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: '切换成功',
                            type: 'success'
                        });
                        _this.handleDecisions();
                    } else {
                        this.$message.error(`切换失败，失败原因：${res.msg}`);
                    }
                });
            }).catch();
        },
        /**
         * 切换决策流运行锁
         * @param row
         */
        handleRunLock(row) {
            let _this = this;
            this.$confirm('是否切换运行锁?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let temp = Object.assign({}, row);
                temp.runLock = row.runLock === 1 ? 0 : 1;
                _this.saveDecision(temp).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            message: '切换成功',
                            type: 'success'
                        });
                        _this.handleDecisions();
                    } else {
                        this.$message.error(`切换失败，失败原因：${res.msg}`);
                    }
                });
            }).catch();
        },
        /**
         * 获取决策流详情
         * @param id
         */
        getDecisionInfo(id) {
            // return service({
                // url: `/decision/${id}`,
                // method: 'get'
            // })
        },
        /**
         * 展示节点树
         * @param decision
         */
        showNode(decision) {
            let _this = this;
            _this.isFullScreen = false;
            if (decision.id) {
                _this.nodeTreeDialogTitle = `${decision.name}节点树`;
                this.decisionNodeTreeVisible = true;
                _this.deletedNodes = [];
                this.$nextTick(function () {
                    if (decision.id) {
                        _this.getDecisionInfo(decision.id).then(res => {
                            if (res.code === 0) {
                                let data = res.data;
                                data.cls = 'decision';
                                let nodes = _this.buildNode(data);
                                let graph = TreeGraph.prototype.getById(_this.nodeTreeId);
                                if (graph) {
                                    graph.read(nodes);
                                } else {
                                    graph = new TreeGraph(_this.nodeTreeId, nodes);
                                    graph.contextMenu = _this.registerMenu();
                                    graph.init();
                                }
                                _this.treeGraph = graph;
                                _this.currentGraph = graph.graph;
                            }
                        });
                    } else {
                        decision.cls = 'decision';
                        let nodes = _this.buildNode(decision);
                        let graph = TreeGraph.prototype.getById(_this.nodeTreeId);
                        if (graph) {
                            graph.read(nodes);
                        } else {
                            graph = new TreeGraph(_this.nodeTreeId, nodes);
                            graph.contextMenu = _this.registerMenu();
                            graph.init();
                        }
                        _this.treeGraph = graph;
                        _this.currentGraph = graph.graph;
                    }
                });
            } else {
                this.$refs['decisionForm'].validate((valid) => {
                    if (valid) {
                        _this.nodeTreeDialogTitle = `${decision.name}节点树`;
                        this.decisionNodeTreeVisible = true;
                        _this.deletedNodes = [];
                        this.$nextTick(function () {
                            if (decision.id) {
                                _this.getDecisionInfo(decision.id).then(res => {
                                    if (res.code === 0) {
                                        let data = res.data;
                                        data.cls = 'decision';
                                        let nodes = _this.buildNode(data);
                                        let graph = TreeGraph.prototype.getById(_this.nodeTreeId);
                                        if (graph) {
                                            graph.read(nodes);
                                        } else {
                                            graph = new TreeGraph(_this.nodeTreeId, nodes);
                                            graph.contextMenu = _this.registerMenu();
                                            graph.init();
                                        }
                                        _this.treeGraph = graph;
                                        _this.currentGraph = graph.graph;
                                    }
                                });
                            } else {
                                decision.cls = 'decision';
                                let nodes = _this.buildNode(decision);
                                let graph = TreeGraph.prototype.getById(_this.nodeTreeId);
                                if (graph) {
                                    graph.read(nodes);
                                } else {
                                    graph = new TreeGraph(_this.nodeTreeId, nodes);
                                    graph.contextMenu = _this.registerMenu();
                                    graph.init();
                                }
                                _this.treeGraph = graph;
                                _this.currentGraph = graph.graph;
                            }
                        });
                    }
                })
            }

        },
        /**
         * 构建节点
         * @param node
         * @returns {*}
         */
        buildNode(node) {
            switch (node.cls) {
                case "treeHead":
                    break;
                case "decision":
                    const reg = /^[\u4E00-\u9FA5]+$/;
                    let gap = 7;
                    let subIndex = gap;
                    let subLength = node.name.length;
                    if (node.name.length > gap && !reg.test(node.name)) {
                        subLength = 0;
                        for (let i = 0; i < node.name.length; i++) {
                            let a = node.name.charAt(i);
                            if (reg.test(a)) {
                                subLength += 1;
                            } else {
                                subLength += 0.5;
                            }
                            if (Math.floor(subLength) === gap) {
                                subIndex = i;
                            }
                        }
                    }
                    let label = subLength > gap
                        ? node.name.substr(0, subIndex) + "\n" + (node.name.substr(subIndex).length > gap
                        ? node.name.substr(subIndex, 6) + "..."
                        : node.name.substr(subIndex))
                        : node.name;
                    Object.assign(node, {
                        id: 'decision_' + node.id,
                        shape: 'rect',
                        label: subLength > 8 ? node.name.substr(0, subIndex) + "\n" + node.name.substr(subIndex) : node.name,
                        size: [210, 70],
                        labelCfg: {
                            style:{fontSize: 18}
                        },
                        style:{
                            radius: 5,
                            padding: 5,
                        }
                    });
                    break;
                case "interface":
                    break;
                default:
                    node.cls = 'node';
                    switch (node.nodeType.toString()) {
                        case '1':
                            let ruleGroup = this.ruleGroupMap.get(node.conditionLeft);
                            console.log(node)
                            console.log("--")
                            console.log(ruleGroup)
                            let institutiongroup=this.institutionMap.get(node.conditionLeft);
                            node = Object.assign(node, {
                                conditionLeftName: ruleGroup.name,
                                //得到当前节点的 机构id 类id 和规则组id
                                conditionLeftOption: [institutiongroup,ruleGroup.rgType.toString(),node.conditionLeft],
                            })

                            ;
                            break;
                        case '2':
                            let fieldCode = this.fieldCodeMap.get(node.conditionLeft);
                            node = Object.assign(node, {
                                conditionLeftName: fieldCode.name,
                                conditionLeftOption: [fieldCode.tableName, node.conditionLeft]
                            });
                            break;
                        default:
                            node.conditionLeftName = node.conditionLeft;
                            break;
                    }
                    break;
            }
            if (node.children && node.children.length > 0) {
                node.children.forEach(n => this.buildNode(n));
            }
            return node;
        },

        /**
         * 保存节点
         * @param nodeTemp
         */
        handleNodeSave: function (nodeTemp) {
            let _this = this;
            this.$refs['nodeForm'].validate((valid) => {
                if (valid) {
                    let graph = _this.currentGraph;
                    let {
                        id, parentId, nodeType, conditionOperation, conditionRight,
                        conditionLeftOption, maxValue, operation
                    } = nodeTemp;

                    if (nodeType === '1' ) {
                        nodeTemp.conditionLeft = conditionLeftOption[2];
                    }
                    else if(nodeType === '2'){
                        nodeTemp.conditionLeft = conditionLeftOption[1];
                    } else {
                        nodeTemp.conditionLeft = conditionLeftOption;
                    }
                    if (conditionOperation === 'between') {
                        nodeTemp.conditionRight = conditionRight + ',' + maxValue;
                    }
                    if (operation === 'add') {
                        graph.addChild(nodeTemp, parentId);
                        const parentNode = graph.findById(parentId);
                        let group = parentNode.getContainer();
                        let cls = parentNode.getModel().cls;
                        let icons = parentNode.get('group').find(e => e.cfg.name === 'collapse-icon');
                        if (icons && cls !== 'decision') {
                            group.addShape('circle', {
                                attrs: {
                                    x: 180 - 5, y: 55 / 2, r: 10, stroke: '#328ffc',
                                    fill: '#ffffff', cursor: 'pointer', isCollapseShape: true,
                                },
                                name: 'collapse-circle'
                            });
                            group.addShape('image', {
                                attrs: {
                                    x: 180 - 14, y: 55 / 2 - 9, width: 16, height: 16,
                                    img: 'js/dependency/iconfont/collapse.svg',
                                    size: 16, cursor: 'pointer', isCollapseShape: true,
                                },
                                name: 'collapse-icon'
                            });
                        }
                    } else if (nodeTemp.operation === 'edit') {
                        const item = graph.findById(id);
                        graph.updateItem(item, nodeTemp);
                    } else if (nodeTemp.operation === 'insert') {
                        if (parentId === '0') {
                            parentId = `decision_${nodeTemp.decisionId}`;
                        }

                        graph.addChild(nodeTemp, parentId);
                        let childrenData = graph.findDataById(nodeTemp.childrenId);
                        //let chi = _this.convertNodeTemp(childrenData);
                        childrenData.parentId = nodeTemp.id;
                        const removed =  graph.removeChild(nodeTemp.childrenId);

                        setTimeout(() => {
                            let data = graph.findDataById(nodeTemp.id);
                            if (data.children) data.children.push(childrenData);
                            else data.children = [childrenData];
                            graph.layout();
                        }, 600);


                        /*graph.render();*/
                        graph.fitCenter();
                    }
                    this.decisionNodeVisible = false;
                }
            })
        },
        /**
         * 保存节点树
         */
        handleNodeTreeSave() {
            let _this = this;
            let graph = TreeGraph.prototype.getGraphById(_this.nodeTreeId);
            let nodes = graph.getNodes();
            if (nodes.length > 0) {
                let firstNode = nodes[0]._cfg.model;
                let data = Object.assign(firstNode, {
                    id: firstNode.id.substring('decision_'.length)
                });
                // service({
                    // url: '/decision',
                    // method: 'post',
                    // data: data
                // }).then(res => {
                //     if (res.code === 0) {
                //         this.$message({
                //             message: '保存成功',
                //             type: 'success'
                //         });
                //         _this.decisionNodeTreeVisible = false;
                //         _this.decisionFormVisible = false;
                //     } else {
                //         this.$message.error(`保存节点树失败，失败原因：${res.msg}`);
                //     }
                // })
            }
        },
        handleNodeTreeSave1() {
            let _this = this;
            let graph = TreeGraph.prototype.getGraphById(_this.nodeTreeId);
            let nodes = graph.getNodes();
            if (nodes.length > 0) {
                let firstNode = nodes[0]._cfg.model;
                let data = Object.assign(firstNode, {
                    id: firstNode.id.substring('decision_'.length)
                });
                // service({
                //     // url: '/decision',
                //     // method: 'post',
                //     // data: data
                // }).then(res => {
                //     if (res.code === 0) {
                //         this.$message({
                //             message: '保存成功',
                //             type: 'success'
                //         });
                //         this.showNode(data);
                //
                //     } else {
                //         this.$message.error(`保存节点树失败，失败原因：${res.msg}`);
                //     }
                // })
            }
        },
        handleMenuEdit(item) {
            let nodeTemp = Object.assign({operation: 'edit'}, item.getModel());
            nodeTemp.nodeType = nodeTemp.nodeType + '';
            const {conditionLeft, conditionOperation, conditionRight} = this.nodeTemp;
            if (conditionOperation === 'in') {
                nodeTemp.inOptions = conditionRight.split(',')
            } else if (conditionOperation === 'between') {
                let betweenValues = conditionRight.split(',');
                nodeTemp.conditionRight = betweenValues[0];
                nodeTemp.maxValue = betweenValues[1];
            }
            this.nodeTemp = nodeTemp;
        },

        delateNowDialogVisible(){
            this.$confirm('是否确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {

                let id = did;
                let decisionId = decid;
                let _this = this;
                let nodeTemp = _this.nodeTemp;
                let graph = _this.currentGraph;
                let data = graph.findDataById(nodeTemp.parentId);
                let lin = [];
                if (nodeTemp.parentId === '0') {
                    data = null;
                    data = par;
                    let childs = data.children;
                    let length2 = data.children.length;
                    for (let x = 0; x < length2; x++) {
                        if (childs[x].id != id)
                            lin.push(childs[x]);
                    }
                }
                let childrenData = chi;
                let length = chiLth;
                for (let i = 0; i < length; i++) {
                    childrenData[i].parentId = nodeTemp.parentId;
                    lin.push(childrenData[i]);
                }
                par.children = lin;
                let decisionNode = _this.currentGraph.findDataById(`decision_${decisionId}`);
                if (decisionNode.deletedNodes) {
                    decisionNode.deletedNodes.push(id);
                } else {
                    decisionNode.deletedNodes = [id];
                }

                graph.render();
                graph.fitCenter();

                _this.delateDialogVisible = false
            }).catch();
        },

        delateAllDialogVisible(){
            this.$confirm('是否确定删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                let id = did
                let decisionId = decid
                let _this = this;
                let graph = _this.currentGraph;
                let decisionNode = _this.currentGraph.findDataById(`decision_${decisionId}`);

                if (decisionNode.deletedNodes) {
                    decisionNode.deletedNodes.push(id);
                } else {
                    decisionNode.deletedNodes = [id];
                }
                _this.currentGraph.removeChild(id);
                graph.render();
                graph.fitCenter();
                _this.delateDialogVisible = false
            }).catch();

        },
        /**
         * 初始化G6配置
         */
        registerMenu() {
            let _this = this;
            return new G6.Menu({
                getContent(graph) {
                    const item = graph.item;
                    const {cls} = item.getModel();
                    if (cls === 'decision') {
                        return `<ul>
                                    <li id="menuAdd"><i class="el-icon-circle-plus-outline"></i>新增</li>
                                </ul>`
                    } else {
                        return `<ul>
                              <li id="menuAdd"><i class="el-icon-circle-plus-outline"></i>新增</li>
                              <li id="menuEdit"><i class="el-icon-edit-outline"></i>修改</li>
                              <li id="menuInsert"><i class="el-icon-folder-add"></i>插入</li>
                              <li id="menuCopy"><i class="el-icon-document-copy"></i>复制</li>
                              <li id="menuPaste" ><i class="el-icon-document"></i>粘贴</li>
                              <li id="menuDelete"><i class="el-icon-delete"></i>删除</li>
                              <li id="menuinfo"><i class="el-icon-search"></i>详情</li>
                            </ul>`
                    }
                },
                handleMenuClick: (target, item) => {
                    let menuId = target.id;
                    const {id, parentId, cls, decisionId = null} = item.getModel();
                    switch (menuId) {
                        case "menuLook":
                            _this.decisionNodeVisible = true;
                            _this.nodeDialogTitle = '查看节点';
                            break;
                        case "menuAdd":
                            _this.decisionNodeVisible = true;
                            _this.nodeDialogTitle = '新增节点';
                            const decision = cls === 'decision' ? id.substr('decision_'.length) : decisionId;
                            _this.resetNodeTemp(id, decision, 'add');
                            this.$nextTick(() => {
                                this.$refs['nodeForm'].clearValidate()
                            });
                            break;
                        case "menuEdit":
                            _this.decisionNodeVisible = true;
                            _this.nodeDialogTitle = '修改节点';
                            _this.handleMenuEdit(item);
                            this.$nextTick(() => {
                                this.$refs['nodeForm'].clearValidate();
                            });
                            break;
                        case "menuinfo":
                            _this.handleMenuEdit(item);
                            var rgruleid=_this.nodeTemp.conditionLeft;
                            if(_this.nodeTemp.nodeType==='1'){

                                layui.use('layer', function () {
                                    layui.layer.open({
                                        type: 2,
                                        title: '查看详情',  //弹出层的标题
                                        fix: false,     //此层是否固定(false--i不固定)
                                        shadeClose: false, //关闭按钮是否有(true有)
                                        skin: 'layui-layer-lan', //加上边框
                                        scrollbar: false,
                                        area: ['80%', '90%'], //开始进来的面积
                                        content: `./rulessetting_add.html?rgruleid=${rgruleid}&isAble=1`,
                                        success: function () {
                                            layui.use('form', function () {
                                                layui.form.render();

                                            });
                                        }
                                    });
                                });
                            }
                            else if(_this.nodeTemp.nodeType==='2')
                            {       //item._cfg.id
                                let data;
                                let fcId=item._cfg.model.conditionLeftOption[1];
                                //这里的138对应着fcId
                                this.desearch(fcId).then(type=>{
                                    data=type.data;
                                    layui.use(['form', 'layer'], function () {
                                        let layer = layui.layer;
                                        let infoFormVue;
                                        let index = layer.open({
                                            type: 2,
                                            content: './field_institution_alert.html',
                                            title: '详情',
                                            offset: 'auto',
                                            area: ['80%', '80%'],
                                            skin: "layui-layer-lan",
                                            maxmin: true,
                                            btn: ["确定", "返回"],
                                            btn1: function (index) {
                                                window["layui-layer-iframe" + index].appVue.submit().then((res)=>{  //TODO 这个地方我不知道该怎么理解，then就是无法判定
                                                    layer.close(index)
                                                    window.parent.location.reload();
                                                })
                                            },
                                            btn2: function (index) {
                                                layer.close(index);
                                            },
                                            success: function () {
                                                window["layui-layer-iframe" + index].appVue.setData(data);
                                            }
                                        });
                                    });
                                });
                            }
                            break;
                        case "menuInsert":
                            _this.decisionNodeVisible = true;
                            _this.nodeDialogTitle = '插入节点';
                            _this.resetNodeTemp(parentId, decisionId, 'insert', id);
                            this.$nextTick(() => {
                                this.$refs['nodeForm'].clearValidate()
                            });
                            break;

                        case "menuCopy":
                            _this.copy_id = null;
                            this.$confirm('是否复制该节点和以该节点为根节点的所有节点？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                            }).then(() => {
                                _this.copy_id = id;
                            }).catch();
                            break;

                        case  "menuPaste":

                            if (!_this.copy_id) {
                                layer.tips('未找到复制内容，请先复制', '.selected');
                                return;
                            }
                            /**
                             * 通过cpoy_id将所需要复制的节点id保存下来
                             */
                            let graph=_this.currentGraph;
                            let cid = _this.copy_id;
                            let current_node = _this.currentGraph.findDataById(id);
                            let copy_node = _this.currentGraph.findDataById(cid);
                            // 将复制部分保存的节点复制到新的节点中
                            // 新建节点的ID随机生成，父节点为当前粘贴节点
                            _this.new_node = JSON.parse(JSON.stringify(copy_node));
                            _this.new_node.parentId = id;
                            _this.new_node.id = _this.createUniqueString();
                            _this.EachNewNode(_this.new_node,id);
                            // 如果当前节点的孩子为空，则孩子节点为新增节点，否则插入
                            if(current_node.children == null) {
                                current_node.children = [_this.new_node];
                            }else{
                                current_node.children.push(_this.new_node)
                            }
                            _this.copy_id = null
                            graph.render();
                            graph.fitCenter();
                            break;


                        case "menuDelete":
                            decid= decisionId
                            did = id
                            chi = item._cfg.model.children
                            chiLth = item._cfg.model.children.length
                            par = item._cfg.parent._cfg.model
                            _this.delateDialogVisible = true;


                            break;

                        default:
                            break;
                    }
                },
                shouldBegin: (evt) => {
                    const {cls} = evt.item.getModel();
                    return cls !== 'treeHead';
                }
            });
        },


        // 如果新建节点不为空且孩子长度大于0
        //将新建节点的孩子节点赋值给当前节点，当前节点的ID随机生成，
        //父亲节点赋值给当前节点的父亲节点，进行循环赋值
        EachNewNode: function (node, parentId) {
            let _this = this
            if (node.children != null && node.children.length > 0) {
                let now_node = node.children;
                for (let    i = 0; i < now_node.length; i++) {
                    now_node[i].id = _this.createUniqueString();
                    now_node[i].parentId = parentId;
                    _this.EachNewNode(now_node[i], now_node[i].id)
                }
            }
            return ;
        },

        /**
         * 标签输入框关闭
         * @param tag
         */
        handleClose(tag) {
            this.nodeTemp.inOptions.splice(this.nodeTemp.inOptions.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.nodeTemp.inOptions.push(inputValue);
                this.nodeTemp.conditionRight = this.nodeTemp.inOptions.join(',')
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        /**
         * 创建一个唯一性字符串，用作新增的节点ID
         * @returns {string}
         */
        createUniqueString() {
            const timestamp = +new Date() + '';
            const randomNum = parseInt((1 + Math.random()) * 65536) + '';
            return (+(randomNum + timestamp)).toString(32)
        },
        /**
         * 获取决策树
         * @returns {*}
         */
        getDecisionTree() {
            // return service({
            //     url: '/decision/tree',
            //     method: 'get'
            // })
        },
        getInterface() {
            // return service({
            //     url: '/interfaceInfo',
            //     method: 'get'
            // })
        },
        /**
         * 展示决策树
         */
        showDecisionTree() {
            let _this = this;
            _this.decisionTreeVisible = true;
            _this.isFullScreen = false;
            _this.deletedNodes = [];
            Promise.all([
                _this.getInterface(),
                _this.getDecisionTree()
            ]).then(res => {
                let interfaceInfos = res[0].data;
                let decisionTree = res[1].data;
                /*interfaceInfos.forEach(interfaceInfo => {
                    interfaceInfo.id = 'interface_' + interfaceInfo.id;
                    interfaceInfo.cls = 'interface';
                    interfaceInfo.shape = 'rect';
                    decisionTree.forEach(decision => {
                        if (interfaceInfo.decision === decision.id) {
                            interfaceInfo.children = decision;
                        }
                    })
                });*/
                decisionTree.forEach(decision => {
                    decision.cls = 'decision';
                });
                let tree = {
                    label: '决策树',
                    shape: 'rect',
                    cls: 'treeHead',
                    children: decisionTree
                };
                let nodes = _this.buildNode(tree);
                let graph = TreeGraph.prototype.getById(_this.decisionTreeId);
                if (graph) {
                    graph.read(nodes);
                } else {
                    graph = new TreeGraph(_this.decisionTreeId, nodes);
                    graph.contextMenu = _this.registerMenu();
                    graph.init();
                }
                _this.treeGraph = graph;
                _this.currentGraph = graph.graph;
            });
        },
        /**
         * 决策树导出为图片
         */
        pdfexport(){
            let _this = this;
            let graph = _this.currentGraph

            graph.downloadFullImage();
        },

        /**
         * 保存决策树
         * @param data
         * @returns {*}
         */
        getTreeSave(data) {
            // return service({
            //     url: '/decision/tree/save',
            //     method: 'post',
            //     data: data
            // })
        },

        /**
         * 从数据库根据fcID查找变量信息
         * */
        desearch(id){
            // return service({
            //     url:manage_url + `/fc-spm`,
            //     method: 'get',
            //     params: {
            //         fcId : id
            //     }
            // })
        }

        ,
        /**
         * 保存决策树
         */
        handleTreeSave() {
            let _this = this;
            let graph = TreeGraph.prototype.getGraphById(_this.decisionTreeId);
            let nodes = graph.getNodes();
            let firstNode = nodes[0]._cfg.model;
            let children = firstNode.children;
            children.forEach(child => child.id = child.id.substring('decision_'.length));
            this.getTreeSave(children).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    _this.decisionTreeVisible = false;
                } else {
                    this.$message.error(`保存决策树失败，失败原因：${res.msg}`);
                }
            })
        },

        handleTreeSave1() {
            let _this = this;
            let graph = TreeGraph.prototype.getGraphById(_this.decisionTreeId);
            let nodes = graph.getNodes();
            let firstNode = nodes[0]._cfg.model;
            let children = firstNode.children;
            children.forEach(child => child.id = child.id.substring('decision_'.length));
            this.getTreeSave(children).then(res => {
                if (res.code === 0) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    _this.showDecisionTree();
                } else {
                    this.$message.error(`保存决策树失败，失败原因：${res.msg}`);
                }
            })
        },
        /**
         * 弹窗关闭
         * @param done
         */
        handleDialogClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        /**
         * 条件改变的时候
         */
        conditionChange() {
            this.nodeTemp.conditionLeftOption = null;
            this.nodeTemp.conditionLeft = null;
        },
        /**
         * 全屏
         */
        IsfullTreeScreen(){
            if(this.isFullScreen == true){
                this.fullScreen()
                this.decisionTreeVisible = false
            }else{
                this.decisionTreeVisible = false
            }
        },

        fullScreen(){
            this.isFullScreen = !this.isFullScreen;
            TreeGraph.prototype.getById()
            let _this = this;
            this.$nextTick(() => {
                const graphDiv = document.getElementById(this.treeGraph.id);
                this.currentGraph.changeSize(graphDiv.offsetWidth, _this.isFullScreen ? graphDiv.offsetHeight + 190 : graphDiv.offsetHeight - 200);
                this.currentGraph.fitCenter();
            });
        },
        IsFullNodeScreen(){
            if(this.isFullScreen == true){
                this.fullScreen();
                this.decisionNodeTreeVisible = false;
            }
            else{
                this.decisionNodeTreeVisible = false;
            }
        }
    },

}
</script>


