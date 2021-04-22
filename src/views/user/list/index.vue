<template>
	<div class="user-list">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色名称">
                <el-input v-model="formInline.user" placeholder="角色名称模糊查询"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="handleAdd">新增角色</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="rolesList"
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
            <el-table-column align="header-center" label="角色名称" width="220">
                <template slot-scope="scope">
                    {{ scope.row.roleName }}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="创建者" width="220">
                <template slot-scope="scope">
                    {{ scope.row.createUserName}}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="创建时间" width="220">
                <template slot-scope="scope">
                    {{ scope.row.createTime}}
                </template>
            </el-table-column>
            <el-table-column align="header-center" label="备注">
                <template slot-scope="scope">
                    {{ scope.row.remark }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope)">设置</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getTableList" />

        <!--Add & Edit Role-->
        <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改角色':'新增角色'" :close-on-click-modal="closeModal">
            <el-form :model="role" :rules="rules" label-width="90px" label-position="left" ref="roleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="role.roleName" placeholder="请输入角色名称" />
                </el-form-item>

                <el-form-item label="菜单权限"  prop="chooseMenus">
                    <el-cascader
                            v-model="role.chooseMenus"
                            :options="options"
                            :props="props"
                            clearable
                            collapse-tags
                            style="width: 100%"></el-cascader>
                </el-form-item>

                <el-form-item label="角色说明" prop="remark">
                    <el-input
                            v-model="role.remark"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            type="textarea"
                            placeholder="请输入内容"
                    />
                </el-form-item>
            </el-form>
            <div style="text-align:right;">
                <el-button @click="cancel('roleForm')">取消</el-button>
                <el-button type="primary" @click="confirmRole('roleForm')">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import { getTable ,roleAdd ,roleAddMenuList,roleModify ,getRoleInfo,roleDelete} from "../../../api/rolesManage";
    import {getSession} from "../../../utils/storage";
    // import path from 'path'
    // import { deepClone } from '@/utils'
    import Pagination from '@/components/Pagination'

    const userInfo = getSession("userInfo");
export default {
	name: 'userList',
    components: {Pagination},
    data(){
	    return{
            formInline: {
                user: '',
                region: ''
            },
            role: {
                roleName: '',
                chooseMenus:[],
                menus:[],
                remark: '',
            },
            routes: [],
            listLoading: true,
            rolesList: [
                {roleId:1,roleName:"lisa",createUserName:"admin",createTime:"2020-03-15",remark:"blackPink"},
                {roleId:2,roleName:"jennie",createUserName:"admin",createTime:"2020-03-15",remark:"blackPink"},
            ],
            dialogVisible: false,
            dialogType: 'new',
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            total: 10,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
            },
            closeModal:false,
            props: { multiple: true },
            options: [],
            roleId:"",
            rules:{
                roleName:[
                    { required: true, message: '角色名称不能为空', trigger: 'blur' },
                ],
                chooseMenus:[
                    { required: true, message: '请选择规则类型', trigger: 'change' },
                ],

            }
        }
    },
    mounted(){
	    this.getTableList();
	    this.getMenuList();
    },
    methods:{
	    getMenuList(){
            roleAddMenuList().then( res => {
                res.map(cur => {
                    this.options.push({
                        value:cur.pid,
                        label:cur.pname,
                        children :[
                        {value:0,label:"仅查看"},
                        {value:1,label:"可编辑"}
                    ]
                    })

                })
            })
        },
        getTableList(){
            this.listLoading = true;
            let params = Object.assign(
                {roleName:this.formInline.user},
                {page:this.listQuery.page},
                {limit:this.listQuery.limit}
            )
            getTable(params).then( res => {
                this.listLoading = false;
                this.rolesList = res.data;
                this.total = res.count
            })
        },
        onSearch() {
            this.getTableList();
        },
        handleAdd() {
            this.dialogType = 'new';
            this.dialogVisible = true;

        },
        handleEdit(scope) {
            this.dialogType = 'edit';
            this.roleId = scope.row.roleId
            getRoleInfo(scope.row.roleId).then( res => {
                this.role.roleName = res.data.roleName;
                this.role.remark = res.data.remark;
                let tempArray = []
                res.data.menus.map( cur => {
                    tempArray.push([cur.pid,cur.isEditable])
                })
                this.role.chooseMenus = tempArray
            })
            this.dialogVisible = true;

        },
        handleDelete({ $index, row }) {
            let param = Object.assign({roleId:row.roleId})
            console.log(param)

            this.$confirm('确定要删除这个角色吗?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(async() => {
                    await roleDelete(param)
                    this.rolesList.splice($index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }
                )
                .then(async () => {
                    this.getTableList();
                })
                .catch(err => { console.error(err) })
        },
        confirmRole(formName){
            this.$refs.roleForm.validate((valid) => {
                if(valid){
                    this.role.chooseMenus.map( cur => {
                        this.role.menus.push({
                            pid:cur[0],
                            isEditable:cur[1]
                        })
                    })
                    this.role = Object.assign(
                        {roleId:this.roleId},
                        {createUserId:userInfo.id},
                        {createUserName:userInfo.username},
                        this.role);

                    if(this.dialogType === "new"){
                        roleAdd(this.role).then( res => {
                            console.log(res)
                            this.$message({
                                type: 'success',
                                message: '保存成功!'
                            })
                            this.dialogVisible = false;
                            this.$refs[formName].resetFields();
                            this.getTableList();
                        })
                    }else{
                        roleModify(this.role).then( res => {
                            console.log(res)
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            })
                            this.dialogVisible = false;
                            this.$refs[formName].resetFields();
                            this.getTableList();
                        })
                    }


                }
            })
        },
        cancel(formName){
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        }


    }

};
</script>

<style scoped>
    .user-list{
        margin-top: 10px;
    }
</style>
