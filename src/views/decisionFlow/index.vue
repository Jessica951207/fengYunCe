<template>
    <div class="user-admin">
        <el-form :inline="true":model="formInline"class="demo-form-inline">
            <el-form-item label="">
                <el-input v-model="formInline.name"placeholder="决策流名称"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="formInline.codename"placeholder="决策流代号"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-select v-model="formInline.productId"placeholder="所属产品">
                    <el-option
                            v-for="item in products"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
            <el-select v-model="formInline.institutionId"placeholder="所属机构">
            <el-option
                    v-for="item in institutions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="">
            <el-select v-model="formInline.status"placeholder="状态">
            <el-option
                    v-for="item in statusArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
            </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"icon="el-icon-search"@click="onSearch">查询</el-button>
                <!--<el-button type="info"icon="el-icon-refresh-left"@click="onReset">重置</el-button>-->
                <el-button type="success"icon="el-icon-plus"@click="addDecision">添加</el-button>
                <el-button type="warning"icon="el-icon-d-caret"@click="decisionTree">决策树</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="tableList"
                  v-loading="listLoading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;margin-top:10px;"
        >
            <el-table-column align="center" type="index" label="序号" width="120">
                <template scope="scope">
                    <span>{{(listQuery.page - 1) * listQuery.limit + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="决策流名称" >
                <template align="center" slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="决策流代号" >
                <template slot-scope="scope">
                    {{ scope.row.codename }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属产品" >
                <template slot-scope="scope">
                    {{ scope.row.productId }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属机构" >
                <template slot-scope="scope">
                    {{ scope.row.institutionId }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" >
                <template slot-scope="scope">
                    {{ scope.row.remark }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <el-button :type="scope.row.status == 1 ? 'success' : 'danger'" size="small" @click="handleStatus(scope)">{{scope.row.status == 1 ? '启用':'禁止'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="运行锁">
                <template slot-scope="scope">
                    <el-button :type="scope.row.runLock == 1 ? 'success' : 'danger'" size="small" @click="handleRunLock(scope)">{{scope.row.runLock == 1 ? '开启':'关闭'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleNode(scope)">节点</el-button>
                    <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTableList" />

        <decision-dialog ref="decisionRef"></decision-dialog>
        <decision-tree ref="decisionTree"></decision-tree>
    </div>
</template>

<script>
    import { getProducts,getInstitutions,getDecisionFlow,getRuleGroups,getDecisionParams} from "../../api/decisionProcess";
    import Pagination from '@/components/Pagination'
    import DecisionDialog from "./components/decisionDialog";
    import DecisionTree from "./components/decisionTree";

    export default {
        name: 'decisionFlow',
        components: {DecisionTree, DecisionDialog, Pagination},
        data(){
            return{
                formInline: {
                },

                institutions:[],
                products:[],
                statusArr:[
                    {value:1,label:"启用"},
                    {value:0,label:"禁止"}
                ],
                listLoading: false,
                tableList: [
                    {name:"jisso",codename:"13524629564",productId:"blackPink",institutionId:"机构1",remark:"d",status:"",runLock:""},
                    {name:"jennie",codename:"13524629564",productId:"blackPink",institutionId:"机构2",remark:"r",status:"",runLock:""},
                ],
                dialogVisible: false,
                dialogType: 'new',
                total: 10,
                listQuery : {
                    page: 1,
                    limit: 20,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: '+id'
                },

            }
        },
        mounted(){
            this.getInitData();
            this.getTableList();

        },
        methods:{
            getInitData(){
                //产品列表
                getProducts().then( res => {
                    res.map(cur => {
                        this.products.push({
                            value:cur.id,
                            label:cur.name,
                        })

                    })
                })
                //机构列表
                getInstitutions().then( res => {
                    console.log(res)
                    res.data.map(cur => {
                        this.institutions.push({
                            value:cur.id,
                            label:cur.name,
                        })

                    })
                })
            },
            getTableList(){
                this.listLoading = true;
                let params = this.formInline;
                getDecisionFlow(params).then( res => {
                    this.listLoading = false;
                    this.tableList = res.data.records;
                    // this.total = res.count
                })
            },
            onSearch() {
                this.getTableList();
            },
            addDecision(){
                this.$refs.decisionRef.open();
            },
            decisionTree(){
                this.$refs.decisionTree.open();
            },
            handleStatus(){},
            handleRunLock(){},
            handleNode(){},
            handleEdit(scope) {
                this.choose.userId = scope.row.id;
                this.choose.username = scope.row.username;
                this.isShow = false;
                this.dialogType = 'edit';
                // let param = Object.assign({roleId:scope.row.id})
                // getUserInfo(scope.row.id).then( res => {
                //     this.user.username = res.data.username;
                //     this.user.phone = res.data.phone;
                //     this.user.email = res.data.email;
                //     this.user.roleList = res.data.roleList
                // })
                this.dialogVisible = true;

            },
            handleDelete({ $index, row }) {
                let param = Object.assign({userId:row.id})
                console.log(param)

                this.$confirm('确定要删除这个角色吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(async() => {
                            // await userDelete(param)
                            this.tableList.splice($index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.getTableList();
                        }
                    )
                    .catch(err => { console.error(err) })
            },


        }

    };
</script>

<style scoped>
    .user-admin{
        margin-top: 10px;
    }
</style>
