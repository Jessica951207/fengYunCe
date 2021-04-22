<template>
	<div class="user-admin">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option label="已生效" value="0"></el-option>
                    <el-option label="待生效" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则组名称">
                <el-input v-model="formInline.rgname" placeholder="请输入规则组名称"></el-input>
            </el-form-item>
            <el-form-item label="所属机构" prop="organization">
                <el-cascader
                        v-model="formInline.organization"
                        :options="organizationOptions"
                        :props="props"
                        clearable
                        collapse-tags
                        style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item label="规则组类型"  prop="ruleGroupType">
                <el-cascader
                        v-model="formInline.ruleGroupType"
                        :options="ruleTypeOptions"
                        :props="props"
                        clearable
                        collapse-tags
                        style="width: 100%"></el-cascader>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增规则组</el-button>
            </el-form-item>
        </el-form>

        <el-table   :data="rulesList"
                    v-loading="listLoading"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;margin-top:10px;">
            <el-table-column align="center" label="序号" width="120">
                <template scope="scope">
                    <span>{{(listQuery.page - 1) * listQuery.limit + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="规则组名称" >
                <template slot-scope="scope">
                    {{ scope.row.rgname }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="简称" >
                <template slot-scope="scope">
                    {{ scope.row.codename}}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="规则组类型" >
                <template slot-scope="scope">
                    {{ scope.row.ruleGroupTypeName}}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="使用机构" >
                <template slot-scope="scope">
                    {{ scope.row.istName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="规则组设置">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="规则组状态">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleState(scope)">已生效</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTableList" />

        <rule-dialog ref="addRuleRef" ></rule-dialog>

    </div>
</template>

<script>
    import { queryOrganization , queryRuleGroupType ,ruleGroupContent ,ruleGroupAdd , ruleGroupDelete,} from "../../api/rules"
    import Pagination from '@/components/Pagination'
    import RuleDialog from "./components/ruleDialog";

export default {
	name: 'userAdmin',
    components: {RuleDialog, Pagination},
    data(){
	    return{
            formInline: {
                status:[],
                rgname:"",
                organization:[],
                ruleGroupType:[]
            },
            organizationOptions:[],
            ruleTypeOptions:[],
            props:{},
            routes: [],
            listLoading:false,
            rulesList: [
                {key:1,rgname:"jisso",codename:"admin",ruleGroupTypeName:"2020-03-15",istName:"blackPink"},
                {key:2,rgname:"jisso",codename:"admin",ruleGroupTypeName:"2020-03-15",istName:"blackPink"},
            ],
            total: 10,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
            },
            dialogType: 'new',
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            menuOptions: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
        }
    },
    mounted(){
        this.getTableList();
	    this.getOrganization();
	    this.getRuleType();
    },
    methods:{
        getOrganization(){
            queryOrganization().then(res => {
                res.data.map( cur => {
                    this.organizationOptions.push(
                        {value:cur.id,label:cur.name},
                    )
                    this.$store.state.orzOptions.push(
                        {value:cur.id,label:cur.name},
                    );
                })
            })
        },
        getRuleType(){
            queryRuleGroupType().then(res => {
                res.map( cur => {
                    this.ruleTypeOptions.push(
                        {value:cur.id,label:cur.name},
                    )
                    this.$store.state.ruleTypeOptions.push(
                        {value:cur.id,label:cur.name},
                    )
                })
            })
        },
        getTableList(){
            this.listLoading = true;
            this.formInline.status.toString();
            let param = Object.assign(
                {rgname:this.formInline.rgname},
                {status:this.formInline.status.toString()},
                {istNmae:this.formInline.organization.toString()},
                {ruleGroupTypeNmae:this.formInline.ruleGroupType.toString()},
                {page:this.listQuery.page},
                {limit:this.listQuery.limit}
            )
            ruleGroupContent(param).then(res => {
                this.listLoading = false;
                this.rulesList = res.data;
                this.total = res.count;
            })
        },
        onSearch() {
           this.getTableList();
        },
        handleAdd() {
            this.$refs.addRuleRef.open();
            this.dialogType = 'new'
            this.$store.state.dialogType = 'new'

        },
        handleEdit(scope) {
            this.$refs.addRuleRef.open();
            this.$refs.addRuleRef.getTableInfo(scope.row.rgruleid);
            this.dialogType = 'edit';
            this.$store.state.dialogType = 'edit';

            this.$store.state.rgruleid = scope.row.rgruleid;
            // console.log("row",scope.row)

        },
        handleDelete({ $index, row }) {
            let param = Object.assign({rgruleid:row.rgruleid})
            this.$confirm('确定要删除这个角色吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async() => {
                    await ruleGroupDelete(param)
                    this.rulesList.splice($index, 1)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                })
                .catch(err => { console.error(err) })
        },
        handleState({ $index,row }){
            this.$confirm('您确定要失效吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then( ()=>{

                })
        },
        getList(){
            console.log("getList")
        }

    }

};
</script>

<style scoped>
    .user-admin{
        margin-top: 10px;
    }
</style>
